import type { QuoteResponse } from './models';

type CustomerOnboardingSentProps = {
  quote: QuoteResponse;
  statusLoading: boolean;
  onNewQuote: () => void;
  onRefresh: () => void;
  onSync: () => void;
  onBack: () => void;
};

export const CustomerOnboardingSent = ({
  quote,
  statusLoading,
  onNewQuote,
  onRefresh,
  onSync,
  onBack,
}: CustomerOnboardingSentProps) => (
  <section className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
    <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Presupuesto registrado</h2>
    <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
      Nº {quote.quoteNumber} · Total estimado {quote.total.toFixed(2)} €
    </p>
    <div className="mt-4 text-xs" style={{ color: '#9ca3af' }}>
      Estado: <strong style={{ color: '#0d1117' }}>{quote.status}</strong> · Canal: {quote.channel}
    </div>
    <div className="mt-6 flex gap-2">
      <button className="btn-primary" onClick={onNewQuote}>Nueva oferta</button>
      <button className="btn-ghost" onClick={onRefresh} disabled={statusLoading}>
        {statusLoading ? 'Consultando...' : 'Actualizar estado'}
      </button>
      <button className="btn-ghost" onClick={onSync} disabled={statusLoading}>
        {statusLoading ? 'Sincronizando...' : 'Sincronizar ERP'}
      </button>
      <button className="btn-ghost" onClick={onBack}>Volver</button>
    </div>
  </section>
);
