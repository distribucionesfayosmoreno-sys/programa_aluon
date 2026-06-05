import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { dashboardTheme } from '../../dashboard/dashboardTheme';
import type { PrintPreviewModalProps } from './PrintPreviewModal.types';
import { printPreviewKindLabel, printPreviewKindTone } from './PrintPreviewModal.types';

const PrintPreviewHeader = ({
  documentKind,
  documentNumber,
  onClose,
}: Pick<PrintPreviewModalProps, 'documentKind' | 'documentNumber' | 'onClose'>) => {
  const tone = printPreviewKindTone[documentKind];
  const label = printPreviewKindLabel[documentKind];

  return (
    <div
      className="flex items-center justify-between px-7 py-5 shrink-0"
      style={{ background: dashboardTheme.surface, borderBottom: `1px solid ${dashboardTheme.border}` }}
    >
      <div className="flex items-center gap-3.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: tone.bg }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: tone.color }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: dashboardTheme.text, letterSpacing: '-0.01em' }}>
            {label}
          </h2>
          <p style={{ fontSize: 10, fontWeight: 700, color: dashboardTheme.muted, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 3 }}>
            {documentNumber}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
          style={{ background: tone.bg, color: tone.color }}
        >
          {label}
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
          style={{ color: dashboardTheme.muted }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = dashboardTheme.surfaceSoft;
            e.currentTarget.style.color = dashboardTheme.text;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = dashboardTheme.muted;
          }}
          aria-label="Cerrar"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const PrintPreviewFooter = ({
  onClose,
  onPrint,
  onSendEmail,
}: Pick<PrintPreviewModalProps, 'onClose' | 'onPrint' | 'onSendEmail'>) => (
  <div
    className="flex items-center justify-center gap-3 px-7 py-5 shrink-0"
    style={{
      background: dashboardTheme.surfaceSoft,
      borderTop: `1px solid ${dashboardTheme.border}`,
    }}
  >
    <button
      type="button"
      onClick={onClose}
      className="px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-200"
      style={{
        background: dashboardTheme.surface,
        color: dashboardTheme.text,
        border: `1px solid ${dashboardTheme.border}`,
        boxShadow: dashboardTheme.shadowSoft,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = dashboardTheme.border; }}
    >
      Cerrar
    </button>

    <button
      type="button"
      onClick={onPrint}
      className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all duration-200"
      style={{
        background: dashboardTheme.tab.active,
        border: `1px solid ${dashboardTheme.tab.active}`,
        boxShadow: '0 4px 14px rgba(240,68,56,0.25)',
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
    >
      Imprimir
    </button>

    {onSendEmail ? (
      <button
        type="button"
        onClick={onSendEmail}
        className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all duration-200"
        style={{
          background: '#4f46e5',
          border: '1px solid #4f46e5',
          boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      >
        Enviar por mail
      </button>
    ) : null}
  </div>
);

const PrintPreviewIframe = ({ printHtml }: { printHtml: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(printHtml);
    doc.close();
  }, [printHtml]);

  return (
    <iframe
      ref={iframeRef}
      title="Vista previa del documento"
      className="w-full border-0"
      style={{ background: '#ffffff', height: '100%', minHeight: 0 }}
      sandbox="allow-same-origin"
    />
  );
};

export const PrintPreviewModal = ({
  open,
  documentKind,
  documentNumber,
  printHtml,
  onClose,
  onPrint,
  onSendEmail,
}: PrintPreviewModalProps) => {
  const handleBackdropClick = useCallback(() => { onClose(); }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const portalTarget =
    typeof document !== 'undefined' ? document.getElementById('main-layout') : null;

  const content = (
    <div
      className="absolute inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(16,24,40,0.46)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Vista previa: ${printPreviewKindLabel[documentKind]} ${documentNumber}`}
    >
      <div className="absolute inset-0" onClick={handleBackdropClick} />

      <div
        className="relative w-full max-w-5xl rounded-2xl flex flex-col overflow-hidden animate-fade-up"
        style={{
          background: dashboardTheme.surface,
          height: 'calc(100vh - 64px)',
          maxHeight: 'calc(100vh - 64px)',
          boxShadow: dashboardTheme.shadow,
          border: `1px solid ${dashboardTheme.border}`,
        }}
      >
        <PrintPreviewHeader
          documentKind={documentKind}
          documentNumber={documentNumber}
          onClose={onClose}
        />

        <div
          className="flex-1 min-h-0 overflow-hidden"
          style={{ background: dashboardTheme.surfaceSoft }}
        >
          <PrintPreviewIframe printHtml={printHtml} />
        </div>

        <PrintPreviewFooter
          onClose={onClose}
          onPrint={onPrint}
          onSendEmail={onSendEmail}
        />
      </div>
    </div>
  );

  return portalTarget ? createPortal(content, portalTarget) : content;
};
