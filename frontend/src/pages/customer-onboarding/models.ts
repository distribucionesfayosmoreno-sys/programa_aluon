export type DoorModel = 'PREMIUM' | 'CLASSIC' | 'INOX' | 'VENECIANA';
export type DoorType = 'PEATONAL' | 'ABATIBLE_UNA' | 'ABATIBLE_DOS' | 'CORREDERA' | 'VALLA';

export type QuoteChannel = 'WHATSAPP' | 'EMAIL' | 'BOTH';
export type QuoteStatus = 'PENDIENTE_VALIDACION' | 'VALIDADO' | 'ENVIADO';
export type QuoteValidationMode = 'AUTO' | 'MANUAL';

export type RegistrationRequest = {
  nombreComercial: string;
  razonSocial?: string;
  personaContacto?: string;
  email: string;
  telefonoWhatsapp: string;
  direccion?: string;
  cp?: string;
  poblacion?: string;
  provincia?: string;
  pais?: string;
};

export type RegistrationResponse = {
  registrationId: string;
  customerId?: string | null;
  nombreComercial: string;
  email: string;
  telefonoWhatsapp: string;
  status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  createdAt: string;
  tariffCode?: string | null;
  autoApproveQuotes?: boolean;
};

export type QuoteItemDraft = {
  doorModel: DoorModel;
  doorType: DoorType;
  widthMm: number;
  heightMm: number;
};

export type QuoteItemResponse = {
  doorModel: DoorModel;
  doorType: DoorType;
  widthMm: number;
  heightMm: number;
  m2: number;
  pricePerM2: number;
  lineTotal: number;
};

export type QuoteCreateRequest = {
  customerId: string;
  channel: QuoteChannel;
  items: QuoteItemDraft[];
};

export type QuoteResponse = {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  contactEmail: string;
  contactWhatsapp: string;
  tariffCode: string;
  status: QuoteStatus;
  validationMode: QuoteValidationMode;
  channel: QuoteChannel;
  total: number;
  createdAt: string;
  validatedAt?: string | null;
  sentAt?: string | null;
  items: QuoteItemResponse[];
};

export type CatalogCard = {
  id: DoorModel;
  label: string;
  image: string;
  description: string;
};

export type ProductTypeCard = {
  id: DoorType;
  label: string;
  image: string;
  description: string;
};
