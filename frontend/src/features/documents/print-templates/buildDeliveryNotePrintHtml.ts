import type { DocumentPrintData } from '../models/documentPrintModels';
import { buildDocumentPrintHtml } from './buildDocumentPrintHtml';

export const buildDeliveryNotePrintHtml = (data: Omit<DocumentPrintData, 'kind'>): string =>
  buildDocumentPrintHtml({ ...data, kind: 'ALBARAN' });

