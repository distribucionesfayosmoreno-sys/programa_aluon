import { useCallback, useState } from 'react';
import type { PrintPreviewDocumentKind } from '../components/PrintPreviewModal.types';

type PrintPreviewState = {
  printHtml: string;
  documentKind: PrintPreviewDocumentKind;
  documentNumber: string;
  emailTo?: string;
  emailSubject?: string;
  emailBody?: string;
};

type OpenPayload = PrintPreviewState;

type UsePrintPreviewResult = {
  isOpen: boolean;
  state: PrintPreviewState | null;
  open: (payload: OpenPayload) => void;
  close: () => void;
  print: () => void;
  sendEmail: () => void;
};

const openPrintWindow = (html: string): void => {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
  }, 500);
};

export const usePrintPreview = (): UsePrintPreviewResult => {
  const [state, setState] = useState<PrintPreviewState | null>(null);

  const open = useCallback((payload: OpenPayload) => {
    setState(payload);
  }, []);

  const close = useCallback(() => {
    setState(null);
  }, []);

  const print = useCallback(() => {
    if (!state) return;
    openPrintWindow(state.printHtml);
  }, [state]);

  const sendEmail = useCallback(() => {
    if (!state) return;
    const subject = encodeURIComponent(state.emailSubject ?? `Documento ${state.documentNumber}`);
    const body = encodeURIComponent(state.emailBody ?? `Adjunto ${state.documentKind} ${state.documentNumber}.`);
    const to = state.emailTo ?? '';
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }, [state]);

  return {
    isOpen: state !== null,
    state,
    open,
    close,
    print,
    sendEmail,
  };
};
