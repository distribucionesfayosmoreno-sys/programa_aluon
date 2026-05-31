import type { DocumentPrintData } from '../models/documentPrintModels';
import { buildDocumentPrintHtml } from './buildDocumentPrintHtml';

export const buildInvoicePrintHtml = (data: Omit<DocumentPrintData, 'kind'>): string =>
  buildDocumentPrintHtml({ ...data, kind: 'FACTURA' });

