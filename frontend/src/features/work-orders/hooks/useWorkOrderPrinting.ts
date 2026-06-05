import { useEffect, useMemo, useState } from 'react';
import type { BudgetData, CutlistResponse, WorkOrderData } from '../models';
import type { EmailSignature } from '../../settings/models';
import { buildBudgetPrintHtml, buildCutlistFormPrintHtml, buildWorkOrderPrintHtml } from '../utils/printTemplates';
import type { PrintPreviewDocumentKind } from '../../documents/components/PrintPreviewModal.types';

type CutlistPrintPayload = {
  doorType: 'PEATONAL' | 'ABATIBLE_UNA' | 'ABATIBLE_DOS' | 'CORREDERA' | 'VALLA';
  doorModelLabel: string;
  doorTypeLabel: string;
  distributor: string;
  budgetNumber: string;
  budgetDate: string;
  color: string;
  installerName: string;
  notes: string;
  porterAutomatic: boolean;
  hingesSide: 'LEFT' | 'RIGHT';
  heightMm: number;
  widthMm: number;
  groundClearanceMm: number;
  automationIncluded: boolean;
  openingSide: 'LEFT' | 'RIGHT';
  heightLeftMm: number | null;
  heightRightMm: number | null;
  widthLeftMm: number | null;
  widthRightMm: number | null;
  railType: 'CARRIL_16' | 'CARRIL_20';
  mountingType: 'A' | 'B';
};

type WorkOrderPrintingParams = {
  budgetData: BudgetData;
  workOrderData: WorkOrderData;
  canPrintBudget: boolean;
  canEmailBudget: boolean;
  canGenerateCutlist: boolean;
  cutlistGenerated: boolean;
  cutlistResult: CutlistResponse | null;
  cutlistForm: CutlistPrintPayload;
  onRequestPrintPreview?: (request: PrintPreviewRequest) => void;
};

export type PrintPreviewRequest = {
  printHtml: string;
  documentKind: PrintPreviewDocumentKind;
  documentNumber: string;
  emailTo?: string;
  emailSubject?: string;
  emailBody?: string;
};

export const useWorkOrderPrinting = ({
  budgetData,
  workOrderData,
  canPrintBudget,
  canEmailBudget,
  canGenerateCutlist,
  cutlistGenerated,
  cutlistResult,
  cutlistForm,
  onRequestPrintPreview,
}: WorkOrderPrintingParams) => {
  const [signatureHtml, setSignatureHtml] = useState('');

  useEffect(() => {
    const loadSignature = async () => {
      try {
        const response = await fetch('/api/settings/email-signatures');
        if (!response.ok) return;
        const data = (await response.json()) as EmailSignature[];
        setSignatureHtml(data[0]?.html ?? '');
      } catch {
        // ignore signature errors to avoid blocking email flow
      }
    };

    loadSignature();
  }, []);

  const emailBody = useMemo(() => {
    const base = [
      `Adjunto presupuesto ${budgetData.budgetNumber}.`,
      '',
      `Cliente: ${budgetData.customerName}`,
      `Modelo: ${budgetData.modelLabel}`,
      `Total: ${budgetData.total.toFixed(2)} €`,
      '',
    ].join('\n');

    if (!signatureHtml) return base;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const logoUrl = origin ? `${origin}/aluon-logo.png` : '/aluon-logo.png';
    const compactSignature = signatureHtml.replace(
      /src="data:image\/png;base64,[^"]*"/gi,
      `src="${logoUrl}"`,
    );
    return `${base}\n${compactSignature}`;
  }, [budgetData.budgetNumber, budgetData.customerName, budgetData.modelLabel, budgetData.total, signatureHtml]);

  const openPrintWindow = (html: string, width: number, height: number) => {
    const w = window.open('', '_blank', `width=${width},height=${height}`);
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const handlePrint = () => {
    if (!canPrintBudget) return;
    const html = buildBudgetPrintHtml(budgetData);
    if (onRequestPrintPreview) {
      onRequestPrintPreview({
        printHtml: html,
        documentKind: 'PRESUPUESTO',
        documentNumber: budgetData.budgetNumber,
        emailTo: budgetData.customerEmail,
        emailSubject: `Presupuesto ${budgetData.budgetNumber}`,
        emailBody: emailBody,
      });
      return;
    }
    openPrintWindow(html, 900, 700);
  };

  const handleEmail = () => {
    if (!canEmailBudget) return;
    const subject = `Presupuesto ${budgetData.budgetNumber}`;
    const mail = `mailto:${budgetData.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mail;
  };

  const handleCutlistFormPrint = () => {
    if (!canGenerateCutlist) return;
    const html = buildCutlistFormPrintHtml(cutlistForm);
    if (onRequestPrintPreview) {
      onRequestPrintPreview({
        printHtml: html,
        documentKind: 'PEDIDO',
        documentNumber: budgetData.budgetNumber || 'Despiece',
      });
      return;
    }
    openPrintWindow(html, 1200, 900);
  };

  const handleWorkOrderPrint = () => {
    if (!cutlistResult || !cutlistGenerated) return;
    const html = buildWorkOrderPrintHtml(workOrderData);
    if (onRequestPrintPreview) {
      onRequestPrintPreview({
        printHtml: html,
        documentKind: 'PEDIDO',
        documentNumber: workOrderData.workOrderNumber,
      });
      return;
    }
    openPrintWindow(html, 900, 700);
  };

  return {
    handlePrint,
    handleEmail,
    handleCutlistFormPrint,
    handleWorkOrderPrint,
  };
};

export type UseWorkOrderPrintingResult = ReturnType<typeof useWorkOrderPrinting>;
