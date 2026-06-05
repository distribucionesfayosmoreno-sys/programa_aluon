export type PrintPreviewDocumentKind =
  | 'PRESUPUESTO'
  | 'PEDIDO'
  | 'ALBARAN'
  | 'FACTURA'
  | 'ABONO';

export type PrintPreviewModalProps = {
  open: boolean;
  documentKind: PrintPreviewDocumentKind;
  documentNumber: string;
  printHtml: string;
  onClose: () => void;
  onPrint: () => void;
  onSendEmail?: () => void;
};

export const printPreviewKindLabel: Readonly<Record<PrintPreviewDocumentKind, string>> = {
  PRESUPUESTO: 'Presupuesto',
  PEDIDO: 'Pedido',
  ALBARAN: 'Albarán',
  FACTURA: 'Factura',
  ABONO: 'Abono',
};

export const printPreviewKindTone: Readonly<Record<PrintPreviewDocumentKind, { bg: string; color: string }>> = {
  PRESUPUESTO: { bg: '#eff6ff', color: '#1d4ed8' },
  PEDIDO: { bg: '#fef3c7', color: '#b45309' },
  ALBARAN: { bg: '#ecfeff', color: '#0e7490' },
  FACTURA: { bg: '#f3e8ff', color: '#7c3aed' },
  ABONO: { bg: '#ecfdf5', color: '#047857' },
};
