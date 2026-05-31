import type { DocumentPrintData } from '../models/documentPrintModels';
import { buildDocumentPrintHtml } from './buildDocumentPrintHtml';

export const buildOrderPrintHtml = (data: Omit<DocumentPrintData, 'kind'>): string =>
  buildDocumentPrintHtml({ ...data, kind: 'PEDIDO' });

