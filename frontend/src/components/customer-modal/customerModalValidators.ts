import { Customer } from '../../hooks/useCustomers';

export type DocumentType = Customer['tipoDocumento'];

export const normalizeDocumentNumber = (value: string | null | undefined) =>
  (value || '').replace(/\s+/g, '').replace(/-/g, '').toUpperCase();

export const normalizePostalCodeEs = (value: string | null | undefined) => (value || '').replace(/\D/g, '').slice(0, 5);

export const documentPatternHint = (tipo: DocumentType): string => {
  switch (tipo) {
    case 'DNI':
      return 'Formato: 12345678Z';
    case 'NIE':
      return 'Formato: X1234567L (X/Y/Z + 7 dígitos + letra)';
    case 'CIF':
      return 'Formato: B12345678 (1 letra + 7 dígitos + control)';
    case 'PASAPORTE':
      return 'Formato: A1234567 (3–20 caracteres alfanuméricos)';
    default:
      return 'Formato: ...';
  }
};

const isValidDni = (value: string): boolean => {
  const v = normalizeDocumentNumber(value);
  const match = /^(\d{8})([A-Z])$/.exec(v);
  if (!match) return false;
  const number = Number(match[1]);
  const letter = match[2];
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  return letters[number % 23] === letter;
};

const isValidNie = (value: string): boolean => {
  const v = normalizeDocumentNumber(value);
  const match = /^([XYZ])(\d{7})([A-Z])$/.exec(v);
  if (!match) return false;
  const prefix = match[1] === 'X' ? '0' : match[1] === 'Y' ? '1' : '2';
  const number = Number(`${prefix}${match[2]}`);
  const letter = match[3];
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  return letters[number % 23] === letter;
};

const isValidCif = (value: string): boolean => {
  const v = normalizeDocumentNumber(value);
  const match = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/.exec(v);
  if (!match) return false;

  const letter = match[1];
  const digits = match[2];
  const control = match[3];

  let sumEven = 0;
  let sumOdd = 0;

  for (let i = 0; i < digits.length; i += 1) {
    const digit = Number(digits[i]);
    const position = i + 1; // 1-based
    if (position % 2 === 0) {
      sumEven += digit;
    } else {
      const doubled = digit * 2;
      sumOdd += Math.floor(doubled / 10) + (doubled % 10);
    }
  }

  const total = sumEven + sumOdd;
  const unit = total % 10;
  const controlDigit = (10 - unit) % 10;
  const controlLetter = 'JABCDEFGHI'[controlDigit];

  const forcedDigit = ['A', 'B', 'E', 'H'].includes(letter);
  const forcedLetter = ['K', 'P', 'Q', 'S', 'N', 'W'].includes(letter);

  if (forcedDigit) return control === String(controlDigit);
  if (forcedLetter) return control === controlLetter;

  return control === String(controlDigit) || control === controlLetter;
};

const isValidPassport = (value: string): boolean => {
  const v = normalizeDocumentNumber(value);
  return /^[A-Z0-9]{3,20}$/.test(v);
};

export const validateDocumentNumber = (tipo: DocumentType, value: string | null | undefined): boolean => {
  const normalized = normalizeDocumentNumber(value);
  if (!normalized) return false;

  switch (tipo) {
    case 'DNI':
      return isValidDni(normalized);
    case 'NIE':
      return isValidNie(normalized);
    case 'CIF':
      return isValidCif(normalized);
    case 'PASAPORTE':
      return isValidPassport(normalized);
    default:
      return false;
  }
};

export type PostalCodeLookupResult = {
  poblacion: string;
  ciudad: string;
};

const provinceFromPostalCodeEs = (postalCode: string): string => {
  const cp = normalizePostalCodeEs(postalCode);
  if (cp.length < 2) return '';
  const prefix = cp.slice(0, 2);

  const map: Record<string, string> = {
    '01': 'ÁLAVA',
    '02': 'ALBACETE',
    '03': 'ALICANTE',
    '04': 'ALMERÍA',
    '05': 'ÁVILA',
    '06': 'BADAJOZ',
    '07': 'BALEARES',
    '08': 'BARCELONA',
    '09': 'BURGOS',
    '10': 'CÁCERES',
    '11': 'CÁDIZ',
    '12': 'CASTELLÓN',
    '13': 'CIUDAD REAL',
    '14': 'CÓRDOBA',
    '15': 'A CORUÑA',
    '16': 'CUENCA',
    '17': 'GIRONA',
    '18': 'GRANADA',
    '19': 'GUADALAJARA',
    '20': 'GIPUZKOA',
    '21': 'HUELVA',
    '22': 'HUESCA',
    '23': 'JAÉN',
    '24': 'LEÓN',
    '25': 'LLEIDA',
    '26': 'LA RIOJA',
    '27': 'LUGO',
    '28': 'MADRID',
    '29': 'MÁLAGA',
    '30': 'MURCIA',
    '31': 'NAVARRA',
    '32': 'OURENSE',
    '33': 'ASTURIAS',
    '34': 'PALENCIA',
    '35': 'LAS PALMAS',
    '36': 'PONTEVEDRA',
    '37': 'SALAMANCA',
    '38': 'SANTA CRUZ DE TENERIFE',
    '39': 'CANTABRIA',
    '40': 'SEGOVIA',
    '41': 'SEVILLA',
    '42': 'SORIA',
    '43': 'TARRAGONA',
    '44': 'TERUEL',
    '45': 'TOLEDO',
    '46': 'VALENCIA',
    '47': 'VALLADOLID',
    '48': 'BIZKAIA',
    '49': 'ZAMORA',
    '50': 'ZARAGOZA',
    '51': 'CEUTA',
    '52': 'MELILLA',
  };

  return map[prefix] ?? '';
};

export const lookupPostalCodeEs = async (
  postalCode: string,
  signal: AbortSignal,
): Promise<PostalCodeLookupResult | null> => {
  const cp = normalizePostalCodeEs(postalCode);
  if (cp.length !== 5) return null;

  const response = await fetch(`https://api.zippopotam.us/ES/${cp}`, { signal });
  if (!response.ok) return null;

  const data: unknown = await response.json();
  if (!data || typeof data !== 'object') return null;

  const places = (data as { places?: unknown }).places;
  if (!Array.isArray(places) || places.length === 0) return null;

  const first = places[0] as { [key: string]: unknown };
  const poblacion = typeof first['place name'] === 'string' ? first['place name'] : '';
  const ciudad = provinceFromPostalCodeEs(cp);

  if (!poblacion) return null;
  return { poblacion, ciudad };
};

const normalizePhone = (value: string | null | undefined): string => (value || '').replace(/[^\d+]/g, '');

export const phonePatternHint = 'Formato: +34123456789 o 612345678';

export const validatePhone = (value: string | null | undefined): boolean => {
  const v = normalizePhone(value);
  if (!v) return false;
  if (v.startsWith('+')) {
    return /^\+\d{9,15}$/.test(v);
  }
  return /^\d{9,15}$/.test(v);
};

export const normalizeEmail = (value: string | null | undefined): string => (value || '').trim().toLowerCase();

export const emailPatternHint = 'Formato: nombre@dominio.com';

export const validateEmail = (value: string | null | undefined): boolean => {
  const v = normalizeEmail(value);
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
};

export const normalizeIban = (value: string | null | undefined): string => (value || '').replace(/\s+/g, '').toUpperCase();

export const ibanPatternHint = 'Formato: ES97 1465 8052 5408 6702 6743';

const ibanToNumericString = (iban: string): string => {
  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
  let out = '';
  for (const ch of rearranged) {
    if (ch >= '0' && ch <= '9') {
      out += ch;
    } else if (ch >= 'A' && ch <= 'Z') {
      out += String(ch.charCodeAt(0) - 55);
    } else {
      return '';
    }
  }
  return out;
};

const mod97 = (numeric: string): number => {
  let remainder = 0;
  for (let i = 0; i < numeric.length; i += 1) {
    const digit = numeric.charCodeAt(i) - 48;
    remainder = (remainder * 10 + digit) % 97;
  }
  return remainder;
};

export const validateIban = (value: string | null | undefined): boolean => {
  const iban = normalizeIban(value);
  if (!iban) return false;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;
  const numeric = ibanToNumericString(iban);
  if (!numeric) return false;
  return mod97(numeric) === 1;
};
export const sanitizeCustomer = (
  customer: Partial<Customer> | null | undefined,
  emptyCustomer: Customer,
): Customer => {
  if (!customer) return emptyCustomer;
  const sanitize = (val: string | null | undefined, fallback = '') => val || fallback;
  return {
    ...emptyCustomer,
    ...customer,
    nombreComercial: sanitize(customer.nombreComercial),
    razonSocial: sanitize(customer.razonSocial),
    personaContacto: sanitize(customer.personaContacto),
    tarifa: sanitize(customer.tarifa),
    tipoDocumento: customer.tipoDocumento || 'CIF',
    numeroDocumento: sanitize(customer.numeroDocumento),
    telefono: sanitize(customer.telefono),
    email: sanitize(customer.email),
    direccion: sanitize(customer.direccion),
    cp: sanitize(customer.cp),
    poblacion: sanitize(customer.poblacion),
    provincia: sanitize(customer.provincia),
    pais: sanitize(customer.pais, 'ESPAÑA'),
    iban: sanitize(customer.iban),
    formaPago: sanitize(customer.formaPago),
    diasVencimiento: customer.diasVencimiento ?? 0,
    remanente: customer.remanente ?? 0,
    direccionesEntrega: (customer.direccionesEntrega || []).map(addr => ({
      nombreAlias: sanitize(addr.nombreAlias),
      direccion: sanitize(addr.direccion),
      cp: sanitize(addr.cp),
      poblacion: sanitize(addr.poblacion),
      provincia: sanitize(addr.provincia),
      telefono: sanitize(addr.telefono),
      contacto: sanitize(addr.contacto),
    })),
  };
};
