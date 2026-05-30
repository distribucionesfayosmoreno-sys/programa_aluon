import { useDeferredValue } from 'react';
import { MaskRectSelector } from './components/MaskRectSelector';
import { useDoorVisualSimulation } from './useDoorVisualSimulation';

export const DoorVisualSimulation = () => {
  const { state, actions } = useDoorVisualSimulation();
  const deferredAddress = useDeferredValue(state.address.trim());
  const streetViewEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(deferredAddress || 'Madrid')}&output=embed`;

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
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void actions.loadBaseImage();
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>Tamaño</label>
                <select
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm bg-white"
                  value={state.imageSize}
                  disabled={state.processing}
                  onChange={e => actions.setImageSize(e.target.value === '512x512' ? '512x512' : '640x640')}
                >
                  <option value="640x640">640x640</option>
                  <option value="512x512">512x512</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>FOV</label>
                <input
                  className="mt-2 w-full"
                  type="range"
                  min={10}
                  max={120}
                  value={state.fov}
                  disabled={state.processing}
                  onChange={e => actions.setFov(Number(e.target.value))}
                />
                <div className="text-xs font-bold" style={{ color: '#8b949e' }}>{state.fov}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>Heading</label>
                <input
                  className="mt-2 w-full"
                  type="range"
                  min={0}
                  max={360}
                  value={state.heading ?? 0}
                  disabled={state.processing}
                  onChange={e => actions.setHeading(Number(e.target.value))}
                />
                <div className="text-xs font-bold" style={{ color: '#8b949e' }}>{state.heading ?? 0}</div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>Pitch</label>
                <input
                  className="mt-2 w-full"
                  type="range"
                  min={-90}
                  max={90}
                  value={state.pitch ?? 0}
                  disabled={state.processing}
                  onChange={e => actions.setPitch(Number(e.target.value))}
                />
                <div className="text-xs font-bold" style={{ color: '#8b949e' }}>{state.pitch ?? 0}</div>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary w-full justify-center py-4 rounded-xl text-xs tracking-widest"
              disabled={state.processing || state.address.trim().length === 0}
              onClick={() => void actions.loadBaseImage()}
            >
              {state.processing ? 'PROCESANDO...' : 'CARGAR FACHADA'}
            </button>

            <div className="pt-1">
              <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
                Street View (preview)
              </div>
              {state.baseImageUrl ? (
                <img
                  src={state.baseImageUrl}
                  alt="Google Street View"
                  className="mt-3 w-full h-auto rounded-xl border"
                />
              ) : (
                <div className="mt-3 h-[160px] flex items-center justify-center rounded-xl border border-dashed" style={{ color: '#8b949e', borderColor: '#e8eaed' }}>
                  Sin fachada cargada
                </div>
              )}
            </div>

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
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
                    Explorador manual
                  </div>
                  <div className="text-sm font-semibold" style={{ color: '#0d1117' }}>
                    Usa el mapa embebido para localizar la fachada antes de cargar el snapshot.
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-primary px-4 py-2 rounded-xl text-xs tracking-widest"
                  disabled={state.processing || state.address.trim().length === 0}
                  onClick={() => void actions.loadBaseImage()}
                >
                  CARGAR SNAPSHOT
                </button>
              </div>

              <div className="h-[420px] overflow-hidden rounded-xl border border-dashed bg-white" style={{ borderColor: '#e8eaed' }}>
                <iframe
                  title="Google Maps Street View Explorer"
                  src={streetViewEmbedUrl}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
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
