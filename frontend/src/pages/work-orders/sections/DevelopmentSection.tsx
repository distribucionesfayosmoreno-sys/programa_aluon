import { DOOR_MODELS, DOOR_TYPES } from '../constants';
import type { CutlistDoorModel, CutlistDoorType, CutlistMountingType, CutlistRailType, CutlistResponse } from '../models';
import { Field, FieldLabel, SectionTitle, StatusPill } from '../components/ui';

export const DevelopmentSection = ({
  developmentGenerated,
  cutlistGenerated,
  canGenerateDevelopment,
  canGenerateCutlist,
  cutlistLoading,
  cutlistError,
  doorType,
  doorModel,
  widthMm,
  heightMm,
  groundClearanceMm,
  largueroMm,
  topFrame,
  automationReinforcement,
  railType,
  mountingType,
  tail,
  needsGroundClearance,
  needsLarguero,
  needsTopFrame,
  needsAutomation,
  needsRail,
  needsMounting,
  needsTail,
  cutlistResult,
  cutlistImages,
  cutlistImageIndex,
  activeCutlistIndex,
  cutlistPinnedIndex,
  onGenerateDevelopment,
  onGenerateCutlist,
  onDoorTypeChange,
  onDoorModelChange,
  onWidthChange,
  onHeightChange,
  onGroundClearanceChange,
  onLargueroChange,
  onTopFrameChange,
  onAutomationChange,
  onRailTypeChange,
  onMountingTypeChange,
  onTailChange,
  onCutlistImageChange,
  onCutlistHoverChange,
  onCutlistPinnedChange,
}: {
  developmentGenerated: boolean;
  cutlistGenerated: boolean;
  canGenerateDevelopment: boolean;
  canGenerateCutlist: boolean;
  cutlistLoading: boolean;
  cutlistError: string;
  doorType: CutlistDoorType;
  doorModel: CutlistDoorModel;
  widthMm: number;
  heightMm: number;
  groundClearanceMm: number;
  largueroMm: number;
  topFrame: boolean;
  automationReinforcement: boolean;
  railType: CutlistRailType;
  mountingType: CutlistMountingType;
  tail: boolean;
  needsGroundClearance: boolean;
  needsLarguero: boolean;
  needsTopFrame: boolean;
  needsAutomation: boolean;
  needsRail: boolean;
  needsMounting: boolean;
  needsTail: boolean;
  cutlistResult: CutlistResponse | null;
  cutlistImages: Array<{ src: string; alt: string; label: string }>;
  cutlistImageIndex: number;
  activeCutlistIndex: number | null;
  cutlistPinnedIndex: number | null;
  onGenerateDevelopment: () => void;
  onGenerateCutlist: () => void;
  onDoorTypeChange: (value: CutlistDoorType) => void;
  onDoorModelChange: (value: CutlistDoorModel) => void;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onGroundClearanceChange: (value: number) => void;
  onLargueroChange: (value: 50 | 80) => void;
  onTopFrameChange: (value: boolean) => void;
  onAutomationChange: (value: boolean) => void;
  onRailTypeChange: (value: CutlistRailType) => void;
  onMountingTypeChange: (value: CutlistMountingType) => void;
  onTailChange: (value: boolean) => void;
  onCutlistImageChange: (value: number) => void;
  onCutlistHoverChange: (value: number | null) => void;
  onCutlistPinnedChange: (value: number | null) => void;
}) => (
  <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
    <SectionTitle n="04" label="Desarrollo automático" />
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="btn-primary"
        onClick={onGenerateDevelopment}
        disabled={!canGenerateDevelopment}
        style={{ opacity: canGenerateDevelopment ? 1 : 0.5, cursor: canGenerateDevelopment ? 'pointer' : 'not-allowed' }}
      >
        Generar desarrollo
      </button>
      <button
        type="button"
        className="btn-primary"
        onClick={onGenerateCutlist}
        disabled={!canGenerateCutlist || cutlistLoading}
        style={{ opacity: canGenerateCutlist && !cutlistLoading ? 1 : 0.5, cursor: canGenerateCutlist && !cutlistLoading ? 'pointer' : 'not-allowed' }}
      >
        {cutlistLoading ? 'Generando...' : 'Generar despiece'}
      </button>
      <StatusPill label="Desarrollo generado" ok={developmentGenerated} />
      <StatusPill label="Despiece generado" ok={cutlistGenerated} />
    </div>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <FieldLabel>Tipo de puerta</FieldLabel>
        <select
          className="field"
          value={doorType}
          onChange={e => onDoorTypeChange(e.target.value as CutlistDoorType)}
        >
          {DOOR_TYPES.map(type => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel>Modelo (despiece)</FieldLabel>
        <select
          className="field"
          value={doorModel}
          onChange={e => onDoorModelChange(e.target.value as CutlistDoorModel)}
        >
          {DOOR_MODELS.map(model => (
            <option key={model.id} value={model.id}>{model.label}</option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel>Anchura total (mm)</FieldLabel>
        <Field
          type="number"
          min={0}
          value={widthMm}
          onChange={e => onWidthChange(Number(e.target.value || 0))}
        />
      </div>
      <div>
        <FieldLabel>Altura total (mm)</FieldLabel>
        <Field
          type="number"
          min={0}
          value={heightMm}
          onChange={e => onHeightChange(Number(e.target.value || 0))}
        />
      </div>
      {needsGroundClearance && (
        <div>
          <FieldLabel>Holgura suelo (mm)</FieldLabel>
          <Field
            type="number"
            min={0}
            value={groundClearanceMm}
            onChange={e => onGroundClearanceChange(Number(e.target.value || 0))}
          />
        </div>
      )}
      {needsLarguero && (
        <div>
          <FieldLabel>Larguero</FieldLabel>
          <select
            className="field"
            value={String(largueroMm)}
            onChange={e => onLargueroChange(Number(e.target.value) as 50 | 80)}
          >
            <option value="50">50 mm</option>
            <option value="80">80 mm</option>
          </select>
        </div>
      )}
      {needsTopFrame && (
        <div>
          <FieldLabel>Marco superior</FieldLabel>
          <select
            className="field"
            value={topFrame ? 'yes' : 'no'}
            onChange={e => onTopFrameChange(e.target.value === 'yes')}
          >
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
      )}
      {needsAutomation && (
        <div>
          <FieldLabel>Refuerzo automatización</FieldLabel>
          <select
            className="field"
            value={automationReinforcement ? 'yes' : 'no'}
            onChange={e => onAutomationChange(e.target.value === 'yes')}
          >
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
      )}
      {needsRail && (
        <div>
          <FieldLabel>Carril</FieldLabel>
          <select
            className="field"
            value={railType}
            onChange={e => onRailTypeChange(e.target.value as CutlistRailType)}
          >
            <option value="CARRIL_16">Carril 16</option>
            <option value="CARRIL_20">Carril 20</option>
          </select>
        </div>
      )}
      {needsMounting && (
        <div>
          <FieldLabel>Montaje</FieldLabel>
          <select
            className="field"
            value={mountingType}
            onChange={e => onMountingTypeChange(e.target.value as CutlistMountingType)}
          >
            <option value="A">Montaje A</option>
            <option value="B">Montaje B</option>
          </select>
        </div>
      )}
      {needsTail && (
        <div>
          <FieldLabel>Cola</FieldLabel>
          <select
            className="field"
            value={tail ? 'yes' : 'no'}
            onChange={e => onTailChange(e.target.value === 'yes')}
          >
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
      )}
    </div>
    {cutlistError && (
      <p className="text-xs font-semibold mt-3" style={{ color: '#dc2626' }}>
        {cutlistError}
      </p>
    )}
    <div
      className="mt-6 rounded-2xl p-4"
      style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
            Despiece visual
          </div>
          <div className="text-sm font-bold" style={{ color: '#111827' }}>
            {DOOR_MODELS.find(model => model.id === doorModel)?.label} · {DOOR_TYPES.find(type => type.id === doorType)?.label}
          </div>
          <div className="text-[11px]" style={{ color: '#6b7280' }}>
            {widthMm > 0 && heightMm > 0 ? `${widthMm} × ${heightMm} mm` : 'Introduce medidas para un cálculo preciso.'}
          </div>
          {cutlistResult && (
            <div className="text-[10px] mt-1" style={{ color: '#9ca3af' }}>
              Pasa el ratón por una pieza para resaltarla. Clic para fijar.
            </div>
          )}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cutlistResult ? '#15803d' : '#9ca3af' }}>
          {cutlistResult ? 'Despiece generado' : 'Previsualización'}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-4">
        <div
          className="relative rounded-xl border overflow-hidden min-h-[280px] flex items-center justify-center bg-gray-50"
          style={{ borderColor: activeCutlistIndex !== null && cutlistResult ? '#e5534b' : '#e5e7eb' }}
        >
          {cutlistImages[cutlistImageIndex] && (
            <img
              src={cutlistImages[cutlistImageIndex].src}
              alt={cutlistImages[cutlistImageIndex].alt}
              className="w-full h-full object-cover"
            />
          )}
          {activeCutlistIndex !== null && cutlistResult && (
            <div className="absolute left-4 bottom-4 right-4">
              <div
                className="rounded-xl px-4 py-3 text-xs font-semibold"
                style={{ background: 'rgba(17,24,39,0.85)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <div className="text-[10px] uppercase tracking-widest" style={{ color: '#fca5a5' }}>
                  Pieza seleccionada
                </div>
                <div className="mt-1 font-bold">
                  {cutlistResult.items[activeCutlistIndex]?.description || '—'}
                </div>
                <div className="mt-1 text-[11px]" style={{ color: '#e5e7eb' }}>
                  {cutlistResult.items[activeCutlistIndex]
                    ? `${cutlistResult.items[activeCutlistIndex].units}x · ${cutlistResult.items[activeCutlistIndex].cutMeasure}`
                    : '—'}
                </div>
              </div>
            </div>
          )}
          {!cutlistResult && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                Esperando despiece
              </div>
            </div>
          )}
          {cutlistLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div
                className="w-10 h-10 rounded-full border-2 animate-spin"
                style={{ borderColor: '#e5e7eb', borderTopColor: '#e5534b' }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          {cutlistImages.map((image, index) => {
            const active = index === cutlistImageIndex;
            return (
              <button
                key={`${image.label}-${index}`}
                type="button"
                onClick={() => onCutlistImageChange(index)}
                className="w-full flex items-center gap-3 rounded-xl border p-2 text-left transition"
                style={{
                  background: active ? 'rgba(229,83,75,0.08)' : '#ffffff',
                  borderColor: active ? '#e5534b' : '#e5e7eb',
                  boxShadow: active ? '0 6px 18px rgba(229,83,75,0.15)' : 'none',
                }}
              >
                <img src={image.src} alt={image.alt} className="w-16 h-16 rounded-lg object-cover border" style={{ borderColor: '#e5e7eb' }} />
                <div>
                  <div className="text-xs font-bold" style={{ color: '#111827' }}>{image.label}</div>
                  <div className="text-[10px]" style={{ color: '#6b7280' }}>Vista técnica</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
    {cutlistResult && (
      <div className="mt-6">
        <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
          Resultado despiece
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280' }}>
                <th className="text-left px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>Descripción</th>
                <th className="text-left px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>Unidades</th>
                <th className="text-left px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>Medida corte</th>
              </tr>
            </thead>
            <tbody>
              {cutlistResult.items.map((item, idx) => (
                <tr
                  key={`${cutlistResult.id}-${idx}`}
                  onMouseEnter={() => onCutlistHoverChange(idx)}
                  onMouseLeave={() => onCutlistHoverChange(null)}
                  onClick={() => onCutlistPinnedChange(cutlistPinnedIndex === idx ? null : idx)}
                  style={{
                    background: activeCutlistIndex === idx ? 'rgba(229,83,75,0.08)' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <td className="px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>
                    <div className="flex items-center gap-2">
                      <span>{item.description}</span>
                      {activeCutlistIndex === idx && (
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#e5534b' }}>
                          Activa
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>{item.units}x</td>
                  <td className="px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>{item.cutMeasure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </section>
);
