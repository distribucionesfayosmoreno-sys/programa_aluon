import corte45Img from '../../assets/cutlist/corte45.jpg';
import corte45y90Img from '../../assets/cutlist/corte45y90.jpg';
import corte90Img from '../../assets/cutlist/corte90.jpg';
import lamaImg from '../../assets/cutlist/details/lama.jpg';
import lama100Img from '../../assets/cutlist/details/lama100.jpg';
import lamaAvionImg from '../../assets/cutlist/details/lamaAvion.jpg';
import lamaInoxImg from '../../assets/cutlist/details/lamaInox200.jpg';
import larguero50x80Img from '../../assets/cutlist/details/larguero50x80conPestania.jpg';
import marco1Img from '../../assets/cutlist/details/marco1.jpg';
import marco2Img from '../../assets/cutlist/details/marco2.jpg';
import marco2ConPestaniaImg from '../../assets/cutlist/details/marco2conPestania.jpg';
import marco2ConPestaniaInoxImg from '../../assets/cutlist/details/marco2conPestaniaInox.jpg';
import marcoInoxImg from '../../assets/cutlist/details/marcoInox.jpg';
import perfilRuedasImg from '../../assets/cutlist/details/perfilRuedasCorredera.jpg';
import posteCierreAImg from '../../assets/cutlist/details/posteDeCierrePuertaCorrederaMontajeA.jpg';
import posteCierreBImg from '../../assets/cutlist/details/posteDeCierrePuertaCorrederaMontajeB.jpg';
import tubo80x50Img from '../../assets/cutlist/details/tubo80x50.jpg';
import tuboInoxImg from '../../assets/cutlist/details/tuboInoxidable.jpg';
import tuboRefuerzoImg from '../../assets/cutlist/details/tuboRefuerzoMotor.jpg';
import tuboRefuerzoInoxImg from '../../assets/cutlist/details/tuboRefuerzoMotorInox.jpg';

type CutlistItemImage = {
  src: string;
  alt: string;
};

const SECCIONAL_RULES: Array<{ test: RegExp; image: CutlistItemImage }> = [
  { test: /tubo 50x50 refuerzo motor inoxidable/i, image: { src: tuboRefuerzoInoxImg, alt: 'Refuerzo motor inox' } },
  { test: /tubo 40x15 refuerzo motor/i, image: { src: tuboRefuerzoImg, alt: 'Refuerzo motor' } },
  { test: /tubo inoxidable 60x20/i, image: { src: tuboInoxImg, alt: 'Tubo inoxidable' } },
  { test: /lama 100 avión/i, image: { src: lamaAvionImg, alt: 'Lama Avión' } },
  { test: /lama 200x26/i, image: { src: lamaInoxImg, alt: 'Lama inox' } },
  { test: /lama 100x20/i, image: { src: lama100Img, alt: 'Lama 100' } },
  { test: /lama 200x20/i, image: { src: lamaImg, alt: 'Lama 200' } },
  { test: /perfil ruedas correderas/i, image: { src: perfilRuedasImg, alt: 'Perfil ruedas correderas' } },
  { test: /poste de cierre con pesta\u00f1as|poste de cierre con pestanas/i, image: { src: posteCierreBImg, alt: 'Poste cierre con pestanas' } },
  { test: /poste de cierre sin pesta\u00f1as|poste de cierre sin pestanas/i, image: { src: posteCierreAImg, alt: 'Poste cierre sin pestanas' } },
  { test: /cola superior 80x50|cola motor 80x50/i, image: { src: tubo80x50Img, alt: 'Cola 80x50' } },
  { test: /marco horizontal inox|marco vertical inox/i, image: { src: marcoInoxImg, alt: 'Marco inox' } },
  { test: /marco horizontal 50x50|marco vertical 50x50/i, image: { src: marco1Img, alt: 'Marco 50x50' } },
  { test: /marco horizontal 80x50|marco vertical 80x50/i, image: { src: marco2Img, alt: 'Marco 80x50' } },
  { test: /marco superior 80x50|marco inferior 80x50|marco posterior 80x50|marco de cierre 80x50/i, image: { src: larguero50x80Img, alt: 'Marco 80x50' } },
  { test: /marco superior 50x50|marco inferior 50x50|marco posterior 50x50|marco de cierre 50x50/i, image: { src: marco1Img, alt: 'Marco 50x50' } },
  { test: /larguero vertical 50x80/i, image: { src: marco2ConPestaniaImg, alt: 'Larguero 50x80' } },
  { test: /larguero vertical 50x50/i, image: { src: marco1Img, alt: 'Larguero 50x50' } },
  { test: /marco2conpestanaInox|marco2conpesta\u00f1aInox|pesta\u00f1a.*inox|pestana.*inox/i, image: { src: marco2ConPestaniaInoxImg, alt: 'Marco con pestana inox' } },
];

const LATERAL_RULES: Array<{ test: RegExp; image: CutlistItemImage }> = [
  { test: /45º.*90º|45º.*90/i, image: { src: corte45y90Img, alt: 'Corte 45° y 90°' } },
  { test: /45º|45°|inglete 45/i, image: { src: corte45Img, alt: 'Corte 45°' } },
  { test: /90º|90°|recto/i, image: { src: corte90Img, alt: 'Corte 90°' } },
];

const FALLBACK_SECCIONAL: CutlistItemImage = { src: marco2Img, alt: 'Perfil' };
const FALLBACK_LATERAL: CutlistItemImage = { src: corte90Img, alt: 'Corte 90°' };

export const resolveCutlistItemImages = (description: string) => {
  const seccional = SECCIONAL_RULES.find(rule => rule.test.test(description))?.image ?? FALLBACK_SECCIONAL;
  const lateral = LATERAL_RULES.find(rule => rule.test.test(description))?.image ?? FALLBACK_LATERAL;
  return { seccional, lateral };
};
