import type { QuoteChannel, QuoteItemDraft } from './models';
import { formatDoorModel, formatDoorType } from './customerOnboardingUtils';

type CustomerOnboardingSummaryProps = {
  items: QuoteItemDraft[];
  channel: QuoteChannel;
  submitting: boolean;
  onAddProduct: () => void;
  onSelectChannel: (value: QuoteChannel) => void;
  onFinalize: () => void;
  onBackToCatalog: () => void;
};

const CHANNELS: QuoteChannel[] = ['WHATSAPP', 'EMAIL', 'BOTH'];

export const CustomerOnboardingSummary = ({
  items,
  channel,
  submitting,
  onAddProduct,
  onSelectChannel,
  onFinalize,
  onBackToCatalog,
}: CustomerOnboardingSummaryProps) => (
  <section className="grid gap-4">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Resumen de productos</h2>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Revisa la lista antes de finalizar la oferta.</p>
      </div>
      <button className="btn-ghost" onClick={onAddProduct}>Añadir otro producto</button>
    </div>

    <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
      <div className="grid gap-3">
        {items.map((item, index) => (
          <div key={`${item.doorModel}-${item.doorType}-${index}`} className="flex items-center justify-between text-xs">
            <div>
              <strong style={{ color: '#0d1117' }}>{formatDoorModel(item.doorModel)}</strong>
              <div style={{ color: '#9ca3af' }}>{formatDoorType(item.doorType)} · {item.widthMm}x{item.heightMm} mm</div>
            </div>
            <div className="text-xs" style={{ color: '#9ca3af' }}>
              {(item.widthMm * item.heightMm / 1000000).toFixed(2)} m²
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="field-label">Canal de envío</label>
        <div className="flex gap-2">
          {CHANNELS.map(value => (
            <button
              key={value}
              className={value === channel ? 'btn-primary' : 'btn-ghost'}
              onClick={() => onSelectChannel(value)}
            >
              {value === 'WHATSAPP' ? 'WhatsApp' : value === 'EMAIL' ? 'Email' : 'Ambos'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button className="btn-primary" onClick={onFinalize} disabled={submitting}>
          {submitting ? 'Generando...' : 'Finalizar oferta'}
        </button>
        <button className="btn-ghost" onClick={onBackToCatalog}>Volver al catálogo</button>
      </div>
    </div>
  </section>
);
