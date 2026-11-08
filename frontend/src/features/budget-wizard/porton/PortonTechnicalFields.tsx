import type { CatalogFamilyChild } from '../BudgetWizard.types';
import { defaultPortonConfiguration, isSliding, type PortonCatalog, type PortonConfiguration } from './portonCatalog';

type Props = {
  catalog: PortonCatalog | null;
  loadError: string;
  onRetry: () => void;
  child: CatalogFamilyChild;
  value: PortonConfiguration | null;
  onChange: (value: PortonConfiguration | null) => void;
  widthMm: number;
  heightMm: number;
};
const inputClass = 'w-full mt-1 rounded-xl border border-outline-variant/30 bg-surface-container-low p-3 text-xs';

export const PortonTechnicalFields = ({ catalog, loadError, onRetry, child, value, onChange, widthMm, heightMm }: Props) => {
  const variants = catalog?.variants.filter(v => v.doorType === child.doorType && v.productCategory === child.productCategory) ?? [];
  const variant = variants.find(v => v.code === value?.variantCode);
  const panel = catalog?.panels.find(p => p.code === value?.panelCode);
  const patch = (changes: Partial<PortonConfiguration>) => value && onChange({ ...value, ...changes });
  if (catalog && !variants.length) return null;
  return <fieldset className="rounded-2xl border border-outline-variant/30 p-4 space-y-4">
    <legend className="text-xs font-bold px-1">Ficha técnica de portones</legend>
    <p className="text-xs text-secondary">Referencia Portalum para preparar la solicitud. Selecciona esta ficha cuando el producto corresponda a este sistema.</p>
    {loadError && <div role="alert" className="text-xs text-red-700">{loadError} <button type="button" className="underline" onClick={onRetry}>Reintentar</button></div>}
    <label className="flex items-center gap-3 text-xs">
      <input type="checkbox" disabled={!catalog || !variants.length} checked={Boolean(value)} onChange={e => onChange(e.target.checked ? defaultPortonConfiguration(variants[0]) : null)} />
      Añadir configuración técnica de portón{!catalog && !loadError ? ' (cargando…)' : ''}
    </label>
    {value && variant && catalog && <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <label>Variante
          <select className={inputClass} value={value.variantCode} onChange={e => {
            const next = variants.find(v => v.code === e.target.value);
            if (next) onChange({ ...defaultPortonConfiguration(next), finishCode: value.finishCode, customRal: value.customRal });
          }}>{variants.map(v => <option key={v.code} value={v.code}>{v.label}</option>)}</select>
        </label>
        <label>Panel
          <select className={inputClass} value={value.panelCode} onChange={e => patch({ panelCode: e.target.value })}>
            {catalog.panels.filter(p => variant.panelCodes.includes(p.code)).map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
          </select>
        </label>
        <label>Orientación del panel
          <select className={inputClass} value={value.orientation} onChange={e => patch({ orientation: e.target.value as PortonConfiguration['orientation'] })}>
            <option value="HORIZONTAL">Horizontal</option>
            {variant.code !== 'VALLADO_HORIZONTAL' && <option value="VERTICAL">Vertical</option>}
          </select>
        </label>
        <label>Acabado de fabricación
          <select className={inputClass} value={value.finishCode} onChange={e => patch({ finishCode: e.target.value, customRal: null })}>
            {['RAL', 'Madera', 'Anodizado'].map(group => <optgroup key={group} label={group}>
              {catalog.finishes.filter(f => f.group === group).map(f => <option key={f.code} value={f.code}>{f.label}</option>)}
            </optgroup>)}
          </select>
        </label>
        {value.finishCode === 'OTRO_RAL' && <label>RAL solicitado
          <input className={inputClass} inputMode="numeric" maxLength={4} placeholder="Ej. 7016" value={value.customRal ?? ''} onChange={e => patch({ customRal: e.target.value })} />
        </label>}
        {isSliding(variant) && <label>Guía inferior
          <select className={inputClass} value={value.guide ?? ''} onChange={e => patch({ guide: e.target.value as PortonConfiguration['guide'] })}>
            <option value="EMPOTRADA">Empotrada</option><option value="SUPERFICIE">Superficie</option><option value="SIN_GUIA">Sin guía (suministro)</option>
          </select>
        </label>}
        {value.closingProfile && <label>Perfil de cierre
          <select className={inputClass} value={value.closingProfile} onChange={e => patch({ closingProfile: e.target.value as PortonConfiguration['closingProfile'] })}>
            <option value="SOLAPADO">Solapado</option><option value="SUPERFICIE">Superficie</option>
          </select>
        </label>}
      </div>
      <div className="text-xs text-secondary space-y-1">
        <p>Ancho entre muros: {variant.minWidthMm ?? '> 0'}–{variant.maxWidthMm} mm. Alto: {variant.minHeightMm ?? '> 0'}–{variant.maxHeightMm} mm.</p>
        {variant.code.startsWith('VALLADO') && <p>Medidas por fijo. Añade una línea por cada fijo del vallado.</p>}
        {variant.code.startsWith('PEATONAL') && <p>Indica A, L y holgura inferior de 10–15 mm. El mínimo de altura no consta en el análisis.</p>}
        {panel?.kgPerM2 != null && <p>Panel: {panel.kgPerM2} kg/m². Peso orientativo del relleno: {(Math.max(0, widthMm) * Math.max(0, heightMm) / 1000000 * panel.kgPerM2).toFixed(1)} kg; no incluye marco ni herrajes.</p>}
        {value.panelCode === 'SIN_PANEL' && <p>Confirmar medida del galce/cámara antes de fabricar.</p>}
        <p>El acabado seleccionado define la solicitud de fabricación. El color hexadecimal anterior es solo una referencia visual.</p>
      </div>
      {variant.motorAllowed && <div className="space-y-3 text-xs">
        <label className="flex items-center gap-3"><input type="checkbox" checked={value.motorized} onChange={e => patch({ motorized: e.target.checked, safetyPhotocell: false, safetyEdge: false })} />Solicitar motorización</label>
        {value.motorized && <>
          <p className="text-secondary">Motor de referencia: {isSliding(variant) ? 'LIFE DEUS' : 'LIFE OP2 XL + cuadro GE UNI 24R DL3'}. Confirmar dimensionado y precio.</p>
          <label className="flex items-center gap-3"><input type="checkbox" checked={value.safetyPhotocell} onChange={e => patch({ safetyPhotocell: e.target.checked })} />Fotocélula</label>
          <label className="flex items-center gap-3"><input type="checkbox" checked={value.safetyEdge} onChange={e => patch({ safetyEdge: e.target.checked })} />Banda resistiva</label>
        </>}
      </div>}
      <ul className="list-disc pl-4 text-xs text-secondary space-y-1">{catalog.notes.slice(0, 2).map(note => <li key={note}>{note}</li>)}</ul>
      <p className="text-xs text-secondary">Fuente: {catalog.source}</p>
    </>}
  </fieldset>;
};
