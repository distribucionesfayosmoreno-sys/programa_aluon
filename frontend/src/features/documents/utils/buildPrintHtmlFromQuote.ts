import type { QuoteResponse } from '../../customer-onboarding/models';
import type { DocumentPrintData } from '../models/documentPrintModels';
import type { PrintPreviewDocumentKind } from '../components/PrintPreviewModal.types';
import { buildDocumentPrintHtml } from '../print-templates/buildDocumentPrintHtml';

const DEFAULT_COMPANY = {
  name: 'ALUON',
  legalName: 'ALUMINIO SOLDADO, S.L.',
  addressLines: ['Ctra. 4004 Km 29,200', '45290 Pantoja (Toledo)'],
  phone: '925 55 40 14',
  email: 'info@aluon.es',
} as const;

type DocumentKindForPrint = Exclude<PrintPreviewDocumentKind, 'ABONO'>;

const isValidPrintKind = (kind: string): kind is DocumentKindForPrint =>
  ['PRESUPUESTO', 'PEDIDO', 'ALBARAN', 'FACTURA'].includes(kind);

const formatDateForPrint = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
};

export const buildPrintHtmlFromQuote = (
  quote: QuoteResponse,
  kind: PrintPreviewDocumentKind,
  documentNumber: string,
  documentDate: string,
): string => {
  const safeKind: DocumentKindForPrint = isValidPrintKind(kind) ? kind : 'PRESUPUESTO';

  const customerAddressLines = [
    quote.customerDireccion,
    [quote.customerCp, quote.customerPoblacion].filter(Boolean).join(' '),
    quote.customerProvincia,
  ].filter(Boolean) as string[];

  const printData: DocumentPrintData = {
    kind: safeKind,
    documentNumber,
    documentDate: formatDateForPrint(documentDate),
    company: { ...DEFAULT_COMPANY },
    customer: {
      name: quote.customerNombreComercial || quote.customerName,
      taxId: quote.customerNumeroDocumento ? `${quote.customerTipoDocumento || 'CIF/NIF'}: ${quote.customerNumeroDocumento}` : undefined,
      addressLines: customerAddressLines,
      phone: quote.customerTelefono ?? undefined,
      email: quote.contactEmail ?? undefined,
    },
    lines: quote.items.map((item, index) => ({
      position: index + 1,
      description: [
        `${item.doorModel} — ${item.doorType.replace(/_/g, ' ')}`,
        `${item.widthMm} × ${item.heightMm} mm`,
        `${item.m2.toFixed(2)} m²`,
      ].join('\n'),
      quantity: item.m2,
      unitLabel: 'm²',
      unitPriceEur: item.pricePerM2,
      totalEur: item.lineTotal,
    })),
    totals: {
      subtotalEur: quote.total / 1.21,
      vatPercent: 21,
      vatAmountEur: quote.total - quote.total / 1.21,
      totalEur: quote.total,
    },
    footerLines:
      safeKind === 'PRESUPUESTO'
        ? [
            'Condiciones generales:',
            'Forma de pago: a la aceptación del presupuesto 50%, resto el día anterior del suministro del material.',
            'Validez del presupuesto: 15 días.',
            'Cualquier modificación de la presente oferta llevará consigo un nuevo estudio.',
          ]
        : undefined,
  };

  return buildDocumentPrintHtml(printData);
};
