import type { DoorModel, DoorType } from './models';
import { DOOR_TYPES } from './cutlistConstants';
import { formatDoorType, formatModel } from './cutlistUtils';

type CutlistHeroProps = {
  selectedDoorType: DoorType | null;
  selectedModel: DoorModel | null;
  previewImage: string;
};

export const CutlistHero = ({ selectedDoorType, selectedModel, previewImage }: CutlistHeroProps) => (
  <div className="space-y-6 print-hide">
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 20% 20%, rgba(229,83,75,0.12), transparent 55%)' }}
      />
      <div className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 p-8">
        <div className="space-y-4">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            Despiece Inteligente
          </div>
          <h1 className="text-3xl font-black text-slate-900">Calculadora de Despiece ALUON</h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Moderniza el despiece con un flujo guiado, validaciones fuertes y conexión directa con Spring Boot.
            Los resultados se generan con la misma lógica del motor de producción.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {DOOR_TYPES.map(type => (
              <div
                key={type.value}
                className={`rounded-2xl border px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
                  selectedDoorType === type.value ? 'border-transparent' : 'border-slate-200'
                }`}
                style={
                  selectedDoorType === type.value
                    ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 12px 30px var(--accent-shadow-light)' }
                    : { background: '#fff', color: '#94a3b8' }
                }
              >
                {type.label}
              </div>
            ))}
          </div>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
          <img src={previewImage} alt="Vista previa" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/10 to-transparent" />
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">Modelo Seleccionado</div>
              <div className="text-2xl font-black text-white mt-2">{formatModel(selectedModel)}</div>
            </div>
            <div className="rounded-2xl bg-white/15 backdrop-blur px-4 py-3 text-xs text-white">
              {selectedDoorType
                ? `Configuración activa: ${formatDoorType(selectedDoorType)}`
                : 'Selecciona un tipo de puerta para empezar.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
