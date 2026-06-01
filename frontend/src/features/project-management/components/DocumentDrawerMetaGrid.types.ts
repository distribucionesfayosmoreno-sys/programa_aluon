export type DocumentDrawerMetaValues = {
  nombreComercial: string;
  contactEmail: string;
  telefono: string;
  direccionEntrega: string;
  direccion: string;
  cp: string;
  poblacion: string;
  provincia: string;
};

export type DocumentDrawerMetaMode = 'read' | 'edit';

export type DocumentDrawerMetaGridProps = {
  mode: DocumentDrawerMetaMode;
  values: DocumentDrawerMetaValues;
  onChange?: (patch: Partial<DocumentDrawerMetaValues>) => void;
};

