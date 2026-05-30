import { useState, useEffect } from 'react';
import type { QuoteResponse } from '../../customer-onboarding/models';

type Props = {
  quote: QuoteResponse;
  postFinalizeAction?: 'EMAIL' | 'WHATSAPP' | 'VIEW' | null;
  onNew: () => void;
  onSendChannel: (channel: 'EMAIL' | 'WHATSAPP' | 'BOTH') => Promise<void>;
  submitting: boolean;
};

export const BudgetWizardDoneStep = ({ quote, postFinalizeAction, onNew, onSendChannel, submitting }: Props) => {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState(quote.contactEmail || '');
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSentStatus('Enviando...');
      await onSendChannel('EMAIL');
      setSentStatus('¡Enviado con éxito!');
      setTimeout(() => setEmailModalOpen(false), 2000);
    } catch {
      setSentStatus('Error al enviar.');
    }
  };

  const handleSendWhatsapp = async () => {
    try {
      await onSendChannel('WHATSAPP');
      const text = encodeURIComponent(
        `Hola, te adjunto el Presupuesto oficial Nº ${quote.quoteNumber} de ALUON por un importe total de ${quote.total.toFixed(2)} €. Puedes consultar los detalles aquí.`
      );
      const url = `https://api.whatsapp.com/send?phone=${quote.contactWhatsapp || ''}&text=${text}`;
      window.open(url, '_blank');
    } catch {
      alert('Error al enviar por WhatsApp.');
    }
  };

  useEffect(() => {
    if (!postFinalizeAction) return;

    if (postFinalizeAction === 'EMAIL') {
      setEmailModalOpen(true);
    } else if (postFinalizeAction === 'WHATSAPP') {
      handleSendWhatsapp();
    } else if (postFinalizeAction === 'VIEW') {
      window.print();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postFinalizeAction]);

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-sm animate-bounce">
          <span className="material-symbols-outlined text-3xl font-black">done</span>
        </div>
        <h3 className="font-headline font-bold text-2xl text-on-surface mt-4">¡Presupuesto Generado!</h3>
        <p className="text-xs text-secondary mt-1">El presupuesto se ha guardado en tu cuenta.</p>
      </div>

      {/* Info Card */}
      <div className="bg-surface-container rounded-2xl border border-outline-variant/20 p-5 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary font-bold uppercase tracking-wider">Nº Presupuesto</span>
          <span className="font-black text-on-surface bg-surface-container-high py-1 px-3 rounded-lg">
            {quote.quoteNumber}
          </span>
        </div>

        <div className="h-px bg-outline-variant/20" />

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-secondary font-bold block uppercase tracking-wider text-[10px]">Cliente</span>
            <span className="font-black text-on-surface mt-1 block">{quote.customerName}</span>
          </div>
          <div className="text-right">
            <span className="text-secondary font-bold block uppercase tracking-wider text-[10px]">Importe Total</span>
            <span className="text-lg font-black text-blue-600 mt-0.5 block">{quote.total.toFixed(2)} €</span>
          </div>
        </div>

        <div className="h-px bg-outline-variant/20" />

        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary font-bold uppercase tracking-wider">Estado</span>
          <span className="font-black px-2.5 py-1 rounded-full uppercase tracking-widest text-[9px] bg-green-50 text-green-700">
            {quote.status}
          </span>
        </div>
      </div>

      {/* Detailed Budget Lines - "El Presupuesto Real" */}
      <div className="bg-surface rounded-3xl border border-outline-variant/35 p-5 space-y-4 shadow-sm print:border-none print:shadow-none">
        <h4 className="font-space font-black text-xs uppercase tracking-wider text-blue-600">Detalle del Presupuesto</h4>
        
        <div className="divide-y divide-outline-variant/20">
          {quote.items.map((item, idx) => (
            <div key={idx} className="py-3.5 space-y-2 first:pt-0 last:pb-0">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-600/10 px-2 py-0.5 rounded-full">
                    Línea {idx + 1}
                  </span>
                  <div className="text-xs font-black text-on-surface mt-1.5 font-space">
                    Modelo {item.doorModel} — {item.doorType.replace('_', ' ')}
                  </div>
                  <div className="text-[10px] text-secondary mt-1 font-body">
                    Categoría: {item.productCategory.replace('_', ' ')} · Medidas: {item.widthMm} x {item.heightMm} mm ({item.m2.toFixed(2)} m²)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-on-surface font-space">
                    {item.lineTotal.toFixed(2)} €
                  </div>
                  <div className="text-[9px] text-secondary mt-0.5">
                    {item.pricePerM2.toFixed(2)} € / m²
                  </div>
                </div>
              </div>

              {/* Specs Badge list */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                <span className="text-[8px] font-bold text-secondary uppercase bg-surface-container px-2 py-0.5 rounded font-space flex items-center gap-1">
                  Color: {item.colorCode}
                  <div className="w-2 h-2 rounded-full border border-outline-variant/30" style={{ backgroundColor: item.colorCode }} />
                </span>
                {item.primerRequired && (
                  <span className="text-[8px] font-bold text-secondary uppercase bg-surface-container px-2 py-0.5 rounded font-space">
                    Imprimación
                  </span>
                )}
                {item.larguero && (
                  <span className="text-[8px] font-bold text-secondary uppercase bg-surface-container px-2 py-0.5 rounded font-space">
                    Larguero
                  </span>
                )}
                {item.marcoSuperior && (
                  <span className="text-[8px] font-bold text-secondary uppercase bg-surface-container px-2 py-0.5 rounded font-space">
                    Marco Sup.
                  </span>
                )}
                {item.bisagras && (
                  <span className="text-[8px] font-bold text-secondary uppercase bg-surface-container px-2 py-0.5 rounded font-space">
                    Apertura: Derecha
                  </span>
                )}
                {item.porteroAutomatico && (
                  <span className="text-[8px] font-bold text-secondary uppercase bg-surface-container px-2 py-0.5 rounded font-space">
                    Portero Auto.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-outline-variant/20 pt-1" />

        {/* Totals Summary */}
        <div className="flex justify-between items-center text-xs font-space pt-1">
          <span className="text-secondary font-black uppercase tracking-wider">Subtotal</span>
          <span className="font-bold text-on-surface">{(quote.total / 1.21).toFixed(2)} €</span>
        </div>
        <div className="flex justify-between items-center text-xs font-space">
          <span className="text-secondary font-black uppercase tracking-wider">I.V.A. (21%)</span>
          <span className="font-bold text-on-surface">{(quote.total - (quote.total / 1.21)).toFixed(2)} €</span>
        </div>
        <div className="flex justify-between items-center text-sm font-space pt-1.5 border-t border-dashed border-outline-variant/30">
          <span className="text-on-surface font-black uppercase tracking-wider">Total Presupuestado</span>
          <span className="text-base font-black text-blue-600">{quote.total.toFixed(2)} €</span>
        </div>
      </div>

      {/* Share / Action Buttons */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-secondary font-bold block">Compartir o Descargar</span>

        <div className="grid grid-cols-2 gap-3">
          {/* Email Button */}
          <button
            type="button"
            onClick={() => setEmailModalOpen(true)}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-outline-variant bg-surface text-on-surface hover:bg-surface-container font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">mail</span>
            Email
          </button>

          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={handleSendWhatsapp}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-outline-variant bg-surface text-on-surface hover:bg-surface-container font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-green-600">chat</span>
            WhatsApp
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-outline-variant bg-surface text-on-surface hover:bg-surface-container font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Imprimir
          </button>

          {/* New Budget Button */}
          <button
            type="button"
            onClick={onNew}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-on-surface hover:bg-on-surface/90 text-surface font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Nuevo Flujo
          </button>
        </div>
      </div>

      {/* Email Modal overlay */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 shadow-xl border border-outline-variant/30">
            <h3 className="text-sm font-black text-on-surface">Enviar por email</h3>
            <p className="text-[10px] text-secondary mt-1">Introduce el correo electrónico.</p>

            <form onSubmit={handleSendEmail} className="mt-4 space-y-4">
              <input
                type="email"
                required
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-xs focus:ring-1 focus:ring-primary outline-none"
                placeholder="correo@ejemplo.com"
                value={targetEmail}
                onChange={e => setTargetEmail(e.target.value)}
              />

              {sentStatus && (
                <div className="text-[10px] font-semibold text-center text-blue-600">
                  {sentStatus}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant/30 text-secondary hover:bg-surface-container rounded-xl text-[10px] font-bold uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                >
                  {submitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
