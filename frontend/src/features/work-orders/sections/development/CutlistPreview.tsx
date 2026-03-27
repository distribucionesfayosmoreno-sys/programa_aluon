import { DOOR_MODELS, DOOR_TYPES } from '../../constants';
import { uiColors } from '../../components/ui';
import type { DevelopmentActions, DevelopmentCutlist, DevelopmentForm, DevelopmentStatus } from './DevelopmentSection.types';

type CutlistPreviewProps = {
  form: Pick<DevelopmentForm, 'doorType' | 'doorModel' | 'widthMm' | 'heightMm'>;
  cutlist: DevelopmentCutlist;
  status: Pick<DevelopmentStatus, 'cutlistLoading'>;
  actions: Pick<DevelopmentActions, 'onCutlistImageChange'>;
};

export const CutlistPreview = ({ form, cutlist, status, actions }: CutlistPreviewProps) => (
  <div
    id="cutlist-visual"
    className="mt-6 rounded-2xl p-4"
    style={{ background: '#ffffff', border: `1px solid ${uiColors.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-xs font-black uppercase tracking-widest" style={{ color: uiColors.textGhost }}>
          Despiece visual
        </div>
        <div className="text-sm font-bold" style={{ color: uiColors.textPrimary }}>
          {DOOR_MODELS.find(model => model.id === form.doorModel)?.label} · {DOOR_TYPES.find(type => type.id === form.doorType)?.label}
        </div>
        <div className="text-[11px]" style={{ color: uiColors.textMuted }}>
          {form.widthMm > 0 && form.heightMm > 0 ? `${form.widthMm} × ${form.heightMm} mm` : 'Introduce medidas para un cálculo preciso.'}
        </div>
        {cutlist.cutlistResult && (
          <div className="text-[10px] mt-1" style={{ color: uiColors.textGhost }}>
            Pasa el ratón por una pieza para resaltarla. Clic para fijar.
          </div>
        )}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cutlist.cutlistResult ? uiColors.success : uiColors.textGhost }}>
        {cutlist.cutlistResult ? 'Despiece generado' : 'Previsualización'}
      </div>
    </div>

    <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-4">
      <div
        className="relative rounded-xl border overflow-hidden min-h-[280px] flex items-center justify-center bg-gray-50"
        style={{ borderColor: cutlist.activeCutlistIndex !== null && cutlist.cutlistResult ? uiColors.accent : uiColors.borderLight }}
      >
        {cutlist.cutlistImages[cutlist.cutlistImageIndex] && (
          <img
            src={cutlist.cutlistImages[cutlist.cutlistImageIndex].src}
            alt={cutlist.cutlistImages[cutlist.cutlistImageIndex].alt}
            className="w-full h-full object-cover"
          />
        )}
        {cutlist.activeCutlistIndex !== null && cutlist.cutlistResult && (
          <div className="absolute left-4 bottom-4 right-4">
            <div
              className="rounded-xl px-4 py-3 text-xs font-semibold"
              style={{ background: 'rgba(17,24,39,0.85)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                Pieza seleccionada
              </div>
              <div className="mt-1 font-bold">
                {cutlist.cutlistResult.items[cutlist.activeCutlistIndex]?.description || '—'}
              </div>
              <div className="mt-1 text-[11px]" style={{ color: uiColors.textOnDark }}>
                {cutlist.cutlistResult.items[cutlist.activeCutlistIndex]
                  ? `${cutlist.cutlistResult.items[cutlist.activeCutlistIndex].units}x · ${cutlist.cutlistResult.items[cutlist.activeCutlistIndex].cutMeasure}`
                  : '—'}
              </div>
            </div>
          </div>
        )}
        {!cutlist.cutlistResult && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: uiColors.textGhost }}>
              Esperando despiece
            </div>
          </div>
        )}
        {status.cutlistLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: uiColors.borderLight, borderTopColor: uiColors.accent }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        {cutlist.cutlistImages.map((image, index) => {
          const active = index === cutlist.cutlistImageIndex;
          return (
            <button
              key={`${image.label}-${index}`}
              type="button"
              onClick={() => actions.onCutlistImageChange(index)}
              className="w-full flex items-center gap-3 rounded-xl border p-2 text-left transition"
              style={{
                background: active ? 'var(--accent-shadow-soft-2)' : '#ffffff',
                borderColor: active ? uiColors.accent : uiColors.borderLight,
                boxShadow: active ? '0 6px 18px var(--accent-shadow-light)' : 'none',
              }}
            >
              <img src={image.src} alt={image.alt} className="w-16 h-16 rounded-lg object-cover border" style={{ borderColor: uiColors.borderLight }} />
              <div>
                <div className="text-xs font-bold" style={{ color: uiColors.textPrimary }}>{image.label}</div>
                <div className="text-[10px]" style={{ color: uiColors.textMuted }}>Vista técnica</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
