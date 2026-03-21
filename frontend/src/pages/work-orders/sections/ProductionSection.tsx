import { SectionTitle } from '../components/ui';

export const ProductionSection = ({
  productionPct,
  prodCut,
  prodFab,
  prodLac,
  prodLacControl,
  canStartProduction,
  cutlistGenerated,
  cutlistResult,
  onProdCutChange,
  onProdFabChange,
  onProdLacChange,
  onProdLacControlChange,
  onOpenWorkOrderModal,
}: {
  productionPct: number;
  prodCut: boolean;
  prodFab: boolean;
  prodLac: boolean;
  prodLacControl: boolean;
  canStartProduction: boolean;
  cutlistGenerated: boolean;
  cutlistResult: boolean;
  onProdCutChange: (value: boolean) => void;
  onProdFabChange: (value: boolean) => void;
  onProdLacChange: (value: boolean) => void;
  onProdLacControlChange: (value: boolean) => void;
  onOpenWorkOrderModal: () => void;
}) => (
  <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
    <SectionTitle n="05" label="Producción" />
    <div className="flex items-center gap-3 mb-4">
      <div className="h-2 w-40 rounded-full" style={{ background: '#e8eaed', overflow: 'hidden' }}>
        <div className="h-full" style={{ width: `${productionPct}%`, background: '#e5534b' }} />
      </div>
      <span className="text-xs font-bold" style={{ color: '#8b949e' }}>{productionPct}%</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <label className="flex items-center gap-3 p-3 rounded-xl" style={{ border: '1px solid #e8eaed', background: '#f9fafb' }}>
        <input
          type="checkbox"
          checked={prodCut}
          onChange={e => onProdCutChange(e.target.checked)}
          disabled={!canStartProduction}
          style={{ accentColor: '#e5534b', width: 16, height: 16 }}
        />
        <span className="text-xs font-bold uppercase" style={{ color: '#0d1117' }}>Corte</span>
      </label>
      <label className="flex items-center gap-3 p-3 rounded-xl" style={{ border: '1px solid #e8eaed', background: '#f9fafb' }}>
        <input
          type="checkbox"
          checked={prodFab}
          onChange={e => onProdFabChange(e.target.checked)}
          disabled={!canStartProduction}
          style={{ accentColor: '#e5534b', width: 16, height: 16 }}
        />
        <span className="text-xs font-bold uppercase" style={{ color: '#0d1117' }}>Fabricación</span>
      </label>
      <label className="flex items-center gap-3 p-3 rounded-xl" style={{ border: '1px solid #e8eaed', background: '#f9fafb' }}>
        <input
          type="checkbox"
          checked={prodLac}
          onChange={e => onProdLacChange(e.target.checked)}
          disabled={!canStartProduction}
          style={{ accentColor: '#e5534b', width: 16, height: 16 }}
        />
        <span className="text-xs font-bold uppercase" style={{ color: '#0d1117' }}>Lacado</span>
      </label>
      <label className="flex items-center gap-3 p-3 rounded-xl" style={{ border: '1px solid #e8eaed', background: '#f9fafb' }}>
        <input
          type="checkbox"
          checked={prodLacControl}
          onChange={e => onProdLacControlChange(e.target.checked)}
          disabled={!canStartProduction}
          style={{ accentColor: '#e5534b', width: 16, height: 16 }}
        />
        <span className="text-xs font-bold uppercase" style={{ color: '#0d1117' }}>Control paso lacado</span>
      </label>
    </div>
    {!canStartProduction && (
      <p className="text-xs mt-3" style={{ color: '#9ca3af' }}>
        Producción habilitada tras aprobación y desarrollo.
      </p>
    )}
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="btn-primary"
        disabled={!cutlistGenerated || !cutlistResult}
        onClick={onOpenWorkOrderModal}
        style={{ opacity: cutlistGenerated && cutlistResult ? 1 : 0.5, cursor: cutlistGenerated && cutlistResult ? 'pointer' : 'not-allowed' }}
      >
        Imprimir orden de trabajo
      </button>
      {!cutlistGenerated && (
        <span className="text-xs font-semibold" style={{ color: '#9ca3af' }}>
          Genera el despiece para habilitar la impresión.
        </span>
      )}
    </div>
  </section>
);
