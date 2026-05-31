import type { BudgetData } from '../../work-orders/models';
import type { DocumentPrintData } from '../models/documentPrintModels';
import { buildDocumentPrintHtml } from './buildDocumentPrintHtml';

const defaultCompany = {
  name: 'ALUON',
  legalName: 'ALUMINIO SOLDADO, S.L.',
  addressLines: ['Ctra. 4004 Km 29,200', '45290 Pantoja (Toledo)'],
  phone: '925 55 40 14',
  email: 'info@aluon.es',
} as const;

export const buildBudgetPrintHtml = (budgetData: BudgetData): string => {
  const lineTotal = Number.isFinite(budgetData.total) ? budgetData.total : 0;
  const unitPrice = Number.isFinite(budgetData.pricePerM2) ? budgetData.pricePerM2 : 0;

  const printData: DocumentPrintData = {
    kind: 'PRESUPUESTO',
    documentNumber: budgetData.budgetNumber,
    documentDate: budgetData.budgetDate,
    company: { ...defaultCompany },
    customer: {
      name: budgetData.customerName,
      addressLines: [budgetData.customerAddress].filter(Boolean),
      phone: budgetData.customerPhone,
      email: budgetData.customerEmail,
    },
    lines: [
      {
        position: 1,
        description: [
          budgetData.modelLabel,
          budgetData.reference ? `Referencia: ${budgetData.reference}` : '',
          Number.isFinite(budgetData.m2) ? `m²: ${budgetData.m2.toFixed(2)}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        quantity: Number.isFinite(budgetData.m2) ? budgetData.m2 : 1,
        unitLabel: 'm²',
        unitPriceEur: unitPrice,
        totalEur: lineTotal,
      },
    ],
    totals: {
      totalEur: lineTotal,
    },
    notes: budgetData.notes,
    footerLines: [
      'Condiciones generales:',
      'Forma de pago: a la aceptación del presupuesto 50%, resto el día anterior del suministro del material.',
      'Validez del presupuesto: 15 días.',
      'Cualquier modificación de la presente oferta llevará consigo un nuevo estudio.',
    ],
  };

  return buildDocumentPrintHtml(printData);
};

