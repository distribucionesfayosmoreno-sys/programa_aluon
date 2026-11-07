"""Import the supplied audit without executing its HTML or requesting remote assets."""
import argparse, base64, hashlib, json, re, unicodedata
from html.parser import HTMLParser
from pathlib import Path
from zipfile import ZipFile

class Node:
    def __init__(self, tag='', attrs=(), parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []
    def text(self):
        return ''.join(c.text() if isinstance(c, Node) else c for c in self.children)
    def all(self, tag=None, cls=None):
        out=[]
        for child in self.children:
            if isinstance(child, Node):
                if (tag is None or child.tag==tag) and (cls is None or cls in child.attrs.get('class','').split()): out.append(child)
                out.extend(child.all(tag,cls))
        return out
    def first(self, tag=None, cls=None):
        return next(iter(self.all(tag,cls)),Node())
class Tree(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.root=Node();self.current=self.root
    def handle_starttag(self,tag,attrs):
        n=Node(tag,attrs,self.current);self.current.children.append(n)
        if tag=='br': n.children.append('\n')
        if tag not in {'img','br','meta','link','input','hr','source','wbr','area','embed','param','col'}:self.current=n
    def handle_endtag(self,tag):
        n=self.current
        while n.parent is not None:
            if n.tag==tag:self.current=n.parent;return
            n=n.parent
    def handle_data(self,data):self.current.children.append(data)
def clean(value):return re.sub(r'\s+',' ',value).strip()
def label(value):return clean(re.sub(r'\s*\[etiqueta vacía en el HTML\]','',value))
def slug(value):
    return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',value).encode('ascii','ignore').decode().lower()).strip('-')
def number(text,key):
    match=re.search(key+r'\s+(-?\d+(?:[.,]\d+)?)',text)
    return float(match[1].replace(',','.')) if match else None

def main():
    parser=argparse.ArgumentParser();parser.add_argument('zip',type=Path);parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);args=parser.parse_args()
    dest=args.root/'frontend/public/reference/marver';dest.mkdir(parents=True,exist_ok=True)
    with ZipFile(args.zip) as archive:
        entry=next(n for n in archive.namelist() if n.endswith('DESARROLLO 2 WEB COMPLETA Revision_web_Grupo_Marver.html'))
        html=archive.read(entry).decode('utf8')
        match=re.search(r'<script>var I=(\[.*?\]);document\.querySelectorAll',html,re.S)
        images=json.loads(match[1]);tree=Tree();tree.feed(html)
        supplemental=Tree();supplemental.feed(archive.read(next(n for n in archive.namelist() if n.endswith('Desarrollo de Presupuestos - Opciones de Haz tu presupuesto.html'))).decode('utf8'))
        source_forms={node.attrs.get('id'):node for node in supplemental.root.all('details','prod')}
        source_lists={node.attrs.get('id'):node for node in supplemental.root.all() if node.attrs.get('id')}

        image_paths={}
        def image(node):
            index=node.attrs.get('data-i')
            if index is None:return None
            uri=images[int(index)]
            if not uri or not uri.startswith('data:image/'):return None
            if uri not in image_paths:
                header,encoded=uri.split(',',1);raw=base64.b64decode(encoded,validate=True)
                ext='png' if 'png' in header else 'jpg';name='images/'+hashlib.sha256(raw).hexdigest()[:20]+'.'+ext
                output=dest/name;output.parent.mkdir(exist_ok=True);output.write_bytes(raw);image_paths[uri]='/reference/marver/'+name
            return image_paths[uri]
        forms=[]
        for section in tree.root.all('section','page'):
            fields=[]
            for row in section.first('table','fields').all('tr'):
                cells=[c for c in row.children if isinstance(c,Node) and c.tag=='td']
                if len(cells)<6:continue
                code=clean(cells[2].text());kind=clean(cells[3].text());options=[]
                for li in cells[4].all('li'):
                    if 'oculta' in li.text() or {'ph','hid'} & set(li.attrs.get('class','').split()):continue
                    option_code=li.first('code').text();option_label=clean(''.join(c.text() if isinstance(c,Node) else c for c in li.children if not isinstance(c,Node) or c.tag!='code'))
                    if option_label:options.append({'value':option_code or option_label,'label':option_label,'image':None})
                fields.append({'id':code+'-'+str(len(fields)), 'sourceKey':code,'label':label(cells[1].text()),'type':kind,'options':options,
                    'min':number(cells[4].text(),'mín'),'max':number(cells[4].text(),'máx'),'help':clean(cells[4].text()) if not options else '',
                    'appearance':clean(cells[5].text()),'showWhen':[],'hideWhen':[],'modelIds':[]})
            source_url=section.first('div','url').text()
            source_id=source_url.rsplit('/',1)[-1].split('.php')[0]
            source_form=source_forms.get(source_id)
            if source_form:
                for question in source_form.all('div','q'):
                    for control in question.all('div','f'):
                        key=clean(control.first('code').text())
                        if not key or any(f['sourceKey']==key for f in fields):continue
                        kind=clean(control.first('span','ty').text())
                        kinds={'Texto':'text','Texto largo':'textarea','Número':'number','Casilla':'checkbox','Archivo adjunto':'file','Desplegable':'select','Tarjetas (una opción)':'radio'}
                        if kind not in kinds:continue
                        chips=control.first('ul','chips')
                        if not chips.children:
                            link=control.first('a','ref').attrs.get('href','')
                            chips=source_lists.get(link.lstrip('#'),Node()).first('ul','chips')
                        options=[{'value':clean(li.text()),'label':clean(li.text()),'image':None} for li in chips.all('li')]
                        txt=control.text()
                        range_match=re.search(r'(\d+)\s*[–-]\s*(\d+)',txt)
                        fields.append({'id':key+'-'+str(len(fields)),'sourceKey':key,'label':label(question.first('h4').text()),'type':kinds[kind],'options':options,
                            'min':float(range_match[1]) if range_match else number(txt,'mín.'),'max':float(range_match[2]) if range_match else None,
                            'help':clean(control.first('p','hint').text()),'appearance':'Adicional: confirmar aplicabilidad','showWhen':[],'hideWhen':[],'modelIds':[]})
            # Galleries contain locally embedded images and the labels of radio options.
            for gallery in section.all('div','gal'):
                siblings=gallery.parent.children;before=siblings[:siblings.index(gallery)]
                heading=next((x for x in reversed(before) if isinstance(x,Node) and x.tag=='h4'),Node())
                source=heading.first('code').text();field=next((f for f in fields if f['sourceKey']==source),None)
                if field is not None:
                    field['options']=[{'value':clean(fig.first('figcaption').text()),'label':clean(fig.first('figcaption').text()),'image':image(fig.first('img'))} for fig in gallery.all('figure')]
            for f in fields:
                f['options']=list({option['value']:option for option in f['options']}.values())
            models=[]
            for model in section.all('div','model'):
                name=clean(model.first('h4').text());source=model.first('code').text();overrides=[]
                for own in model.all('div','own'):
                    for li in own.all('li'):
                        text=li.text();key=text.split(':',1)[0]
                        overrides.append({'label':label(key),'options':clean(li.first('span').text()).split(' / ')})
                link=model.first('a').attrs.get('href');link=link if link and link.startswith('https://grupomarver.es/') else None
                models.append({'id':slug(source or name),'sourceCode':source,'name':name,'image':image(model.first('img')),'url':link,'overrides':overrides})
            for f in fields:
                if f['appearance']!='Todos':
                    owners=[m['id'] for m in models if any(o['label']==f['label'] for o in m['overrides'])]
                    if owners:f['modelIds']=owners
            rules=[]
            for row in section.first('table','rules').all('tr'):
                cells=[c for c in row.children if isinstance(c,Node) and c.tag=='td']
                if len(cells)!=4:continue
                source=next((f for f in fields if f['label']==label(cells[0].text())),None)
                if not source or source['sourceKey']=='entendido':continue
                expected=clean(cells[1].text());rule={'fieldId':source['id'],'value':expected}
                for col,prop in [(2,'showWhen'),(3,'hideWhen')]:
                    for target in cells[col].text().split('\n'):
                        for f in fields:
                            if f['id']!=source['id'] and f['label']==label(target):f[prop].append(rule)
                rules.append({'source':source['label'],'value':expected,'show':cells[2].text().split('\n'),'hide':cells[3].text().split('\n')})
            for f in fields:
                if f['appearance'].startswith('Adicional') and (f['showWhen'] or f['hideWhen']):f['appearance']='Condicional'
            name=clean(section.first('h2').text());category=clean(section.first('div','eyebrow').text())
            if not name:continue
            if not any(f['type']=='file' for f in fields):
                fields.append({'id':'aluon-supporting-document','sourceKey':'aluonSupportingDocument','label':'Información complementaria (PDF o imagen)','type':'file','options':[],'min':None,'max':None,'help':'Plano, fotografía o información para la revisión técnica.','appearance':'ALUON','showWhen':[],'hideWhen':[],'modelIds':[]})
            forms.append({'id':slug(name),'name':name,'category':category,'image':image(section.first('img','catimg')),
                          'models':models,'fields':fields,'rules':rules})
        documents=[]
        for info in archive.infolist():
            if not info.filename.endswith('.pdf') or '__MACOSX' in info.filename:continue
            name=Path(info.filename).name
            try:name=name.encode('cp437').decode('utf8')
            except UnicodeError:pass
            filename=slug(Path(name).stem)+'.pdf';output=dest/'documents'/filename;output.parent.mkdir(exist_ok=True);output.write_bytes(archive.read(info))
            documents.append({'id':slug(Path(name).stem),'name':Path(name).stem,'url':'/reference/marver/documents/'+filename,'sizeBytes':info.file_size})
    catalog={'version':1,'source':'Archivo.zip · revisión Grupo Marver · 28/10/2026','forms':forms,'documents':documents}
    data=json.dumps(catalog,ensure_ascii=False,indent=2)+'\n'
    (dest/'catalog.json').write_text(data)
    backend=args.root/'backend/src/main/resources/catalog/marver-reference.json'
    backend.parent.mkdir(exist_ok=True);backend.write_text(data)
    print(json.dumps({'forms':len(forms),'modelCards':sum(len(f['models']) for f in forms),'fields':sum(len(f['fields']) for f in forms),'images':len(image_paths),'documents':len(documents)},ensure_ascii=False))
if __name__=='__main__':main()
