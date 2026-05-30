import { MaskRectSelector } from './components/MaskRectSelector';
import { useDoorVisualSimulation } from './useDoorVisualSimulation';

export const DoorVisualSimulation = () => {
  const { state, actions } = useDoorVisualSimulation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#0d1117' }}>Simulación Visual de Puertas</h1>
          <p className="text-xs font-semibold" style={{ color: '#8b949e' }}>
            1) Carga fachada · 2) Marca puerta · 3) Inpainting · 4) Resultado
          </p>
        </div>
        <button type="button" className="btn-secondary px-4 py-2 rounded-xl text-xs font-black tracking-widest" onClick={actions.reset}>
          RESET
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 bg-white rounded-2xl p-5 border" style={{ borderColor: '#e8eaed' }}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>Dirección</label>
              <input
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                placeholder="Ej: Calle Mayor 1, Madrid"
                value={state.address}
                onChange={e => actions.setAddress(e.target.value)}
                disabled={state.processing}
              />
            </div>

            <button
              type="button"
              className="btn-primary w-full justify-center py-4 rounded-xl text-xs tracking-widest"
              disabled={state.processing || state.address.trim().length === 0}
              onClick={() => void actions.loadBaseImage()}
            >
              {state.processing ? 'PROCESANDO...' : 'CARGAR FACHADA'}
            </button>

            <div className="pt-2">
              <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>Prompt (opcional)</label>
              <textarea
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm min-h-[88px]"
                placeholder="Describe la puerta deseada..."
                value={state.prompt}
                onChange={e => actions.setPrompt(e.target.value)}
                disabled={state.processing}
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>Negative prompt (opcional)</label>
              <textarea
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm min-h-[72px]"
                placeholder="Cosas a evitar..."
                value={state.negativePrompt}
                onChange={e => actions.setNegativePrompt(e.target.value)}
                disabled={state.processing}
              />
            </div>

            <button
              type="button"
              className="btn-primary w-full justify-center py-4 rounded-xl text-xs tracking-widest"
              disabled={state.processing || !state.jobId || !state.baseImageUrl || !state.maskRect}
              onClick={() => void actions.startInpaint()}
            >
              {state.processing ? 'PROCESANDO...' : 'SIMULAR PUERTA'}
            </button>

            {state.status && (
              <div className="text-xs font-bold" style={{ color: '#8b949e' }}>
                Estado: <span style={{ color: '#0d1117' }}>{state.status}</span>
              </div>
            )}
            {state.error && (
              <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: '#fecaca', background: '#fef2f2', color: '#991b1b' }}>
                {state.error}
              </div>
            )}
          </div>
        </section>

        <section className="lg:col-span-2 bg-white rounded-2xl p-5 border" style={{ borderColor: '#e8eaed' }}>
          {!state.baseImageUrl && (
            <div className="h-[420px] flex items-center justify-center rounded-xl border border-dashed" style={{ color: '#8b949e', borderColor: '#e8eaed' }}>
              Carga una fachada para empezar
            </div>
          )}

          {state.baseImageUrl && state.baseImageWidth && state.baseImageHeight && (
            <div className="space-y-4">
              <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
                Selecciona el rectángulo de la puerta
              </div>
              <MaskRectSelector
                imageUrl={state.baseImageUrl}
                disabled={state.processing}
                value={state.maskRect}
                onChange={actions.setMaskRect}
                imageWidth={state.baseImageWidth}
                imageHeight={state.baseImageHeight}
              />
            </div>
          )}

          {state.resultImageUrl && (
            <div className="mt-6 space-y-3">
              <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
                Resultado
              </div>
              <img src={state.resultImageUrl} alt="Resultado" className="max-w-full h-auto rounded-xl border" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

