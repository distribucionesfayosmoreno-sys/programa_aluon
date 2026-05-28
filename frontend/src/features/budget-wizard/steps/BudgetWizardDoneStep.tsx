import { useState } from 'react';
import type { QuoteResponse } from '../../customer-onboarding/models';

type Props = {
  quote: QuoteResponse;
  onNew: () => void;
  onSendChannel: (channel: 'EMAIL' | 'WHATSAPP' | 'BOTH') => Promise<void>;
  submitting: boolean;
};

export const BudgetWizardDoneStep = ({ quote, onNew, onSendChannel, submitting }: Props) => {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState(quote.contactEmail || '');
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSentStatus('Enviando...');
      await onSendChannel('EMAIL');
      setSentStatus('¡Presupuesto enviado por Email con éxito!');
      setTimeout(() => setEmailModalOpen(false), 2000);
    } catch {
      setSentStatus('Error al enviar el email.');
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

  return (
    <section className="grid gap-6 max-w-xl mx-auto w-full">
      {/* Visual Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-sm animate-bounce">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-gray-900 mt-4">¡Presupuesto Generado con Éxito!</h2>
        <p className="text-xs text-gray-500 mt-1">El presupuesto se ha guardado en la base de datos.</p>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider">Número de Presupuesto</span>
          <span className="font-black text-gray-900 bg-gray-100 py-1 px-3 rounded-lg">{quote.quoteNumber}</span>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Cliente</span>
            <span className="font-black text-gray-900 mt-1 block">{quote.customerName}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Importe Total</span>
            <span className="text-lg font-black text-brand mt-0.5 block">{quote.total.toFixed(2)} €</span>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider">Estado Actual</span>
          <span className="font-black px-2.5 py-1 rounded-full uppercase tracking-widest text-[9px]"
            style={{
              backgroundColor: quote.status === 'ENVIADO' ? '#ecfdf5' : '#fffbeb',
              color: quote.status === 'ENVIADO' ? '#047857' : '#b45309',
            }}
          >
            {quote.status}
          </span>
        </div>
      </div>

      {/* Share / Action Buttons */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Compartir o Descargar</span>

        <div className="grid grid-cols-2 gap-3">
          {/* Email Button */}
          <button
            type="button"
            onClick={() => setEmailModalOpen(true)}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Enviar por Email
          </button>

          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={handleSendWhatsapp}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <svg className="w-4.5 h-4.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.167 1.451 4.793 1.452 5.503 0 9.98-4.482 9.983-9.992.002-2.67-1.04-5.18-2.93-7.073-1.89-1.892-4.407-2.933-7.078-2.934-5.515 0-10.003 4.479-10.006 9.988-.001 1.77.464 3.491 1.348 5.009L.914 21.12l5.733-1.966z" />
            </svg>
            WhatsApp
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>

          {/* New Budget Button */}
          <button
            type="button"
            onClick={onNew}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Nuevo Presupuesto
          </button>
        </div>
      </div>

      {/* Email Modal overlay */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-sm font-black text-gray-900">Enviar presupuesto por email</h3>
            <p className="text-[10px] text-gray-500 mt-1">Introduce el correo electrónico de destino.</p>

            <form onSubmit={handleSendEmail} className="mt-4 space-y-4">
              <input
                type="email"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand outline-none"
                placeholder="correo@ejemplo.com"
                value={targetEmail}
                onChange={e => setTargetEmail(e.target.value)}
              />

              {sentStatus && (
                <div className="text-[10px] font-semibold text-center text-brand">
                  {sentStatus}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-brand text-white hover:bg-brand/90 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: '#a92f32' }}
                >
                  {submitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
