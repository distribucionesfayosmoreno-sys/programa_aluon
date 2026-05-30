import { useDeferredValue } from 'react';
import { GoogleStreetViewExplorer } from './components/GoogleStreetViewExplorer';
import { MaskRectSelector } from './components/MaskRectSelector';
import { useDoorVisualSimulation } from './useDoorVisualSimulation';
import { DoorConfigurator } from './components/DoorConfigurator';
import { BudgetAssigner } from './components/BudgetAssigner';

export const DoorVisualSimulation = () => {
  const { state, actions } = useDoorVisualSimulation();
  const deferredAddress = useDeferredValue(state.address);

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-6">

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <section className="w-full lg:w-[450px] shrink-0 min-h-0 overflow-y-auto bg-white rounded-2xl p-5 border flex flex-col" style={{ borderColor: '#e8eaed' }}>
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

            <div className="pt-4 border-t border-dashed" style={{ borderColor: '#e8eaed' }}>
              <DoorConfigurator state={state} actions={actions} />
            </div>

            <button
              type="button"
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl text-xs tracking-widest border-b border-white/50 shadow-sm"
              disabled={state.processing || !state.jobId || !state.baseImageUrl || !state.maskRect}
              onClick={() => void actions.startInpaint()}
            >
              <span>{state.processing ? 'PROCESANDO...' : 'SIMULAR PUERTA'}</span>
              {!state.processing && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/>
                  <path d="M2 20h20"/>
                  <path d="M14 12v.01"/>
                </svg>
              )}
              {state.processing && (
                <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
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
            
            <BudgetAssigner state={state} actions={actions} />
          </div>
        </section>

        <section className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl p-5 border" style={{ borderColor: '#e8eaed' }}>
          {!state.baseImageUrl && (
            <div className="flex flex-col flex-1 min-h-0 space-y-4">
              <div className="flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f8f9fb] flex items-center justify-center text-[#8b949e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: '#8b949e' }}>
                    Usa el mapa embebido para localizar la fachada antes de cargar el snapshot.
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-primary px-4 py-2 rounded-xl text-xs tracking-widest shrink-0"
                  disabled={state.processing || state.viewerLoading || state.address.trim().length === 0}
                  onClick={() => void actions.loadBaseImage()}
                >
                  CARGAR SNAPSHOT
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-dashed bg-white relative" style={{ borderColor: '#e8eaed' }}>
                {state.address.trim() === '' ? (
                  <img src="/background-visor.png" alt="Background Emulador" className="w-full h-full object-fill" />
                ) : state.mapsJavaScriptApiKey ? (
                  <GoogleStreetViewExplorer
                    apiKey={state.mapsJavaScriptApiKey}
                    address={deferredAddress}
                    heading={state.heading}
                    pitch={state.pitch}
                    onPositionChange={position => actions.setCoordinates(position?.lat ?? null, position?.lng ?? null)}
                    onPovChange={pov => {
                      actions.setHeading(pov.heading);
                      actions.setPitch(pov.pitch);
                    }}
                    onLoadingChange={actions.setViewerLoading}
                    onError={actions.setErrorMessage}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold" style={{ color: '#8b949e' }}>
                    Falta configurar `GOOGLE_MAPS_BROWSER_API_KEY` o `GOOGLE_STREET_VIEW_API_KEY` para el visor interactivo.
                  </div>
                )}
              </div>
            </div>
          )}

          {state.baseImageUrl && state.baseImageWidth && state.baseImageHeight && (
            <div className="flex flex-col flex-1 min-h-0 space-y-4">
              <div className="text-xs font-black uppercase tracking-widest shrink-0" style={{ color: '#8b949e' }}>
                Selecciona el rectángulo de la puerta
              </div>
              <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-xl border bg-gray-50">
                <MaskRectSelector
                  imageUrl={state.baseImageUrl}
                  disabled={state.processing}
                  value={state.maskRect}
                  onChange={actions.setMaskRect}
                  imageWidth={state.baseImageWidth}
                  imageHeight={state.baseImageHeight}
                />
              </div>
            </div>
          )}

          {state.resultImageUrl && (
            <div className="mt-6 flex flex-col flex-1 min-h-0 space-y-3">
              <div className="text-xs font-black uppercase tracking-widest shrink-0" style={{ color: '#8b949e' }}>
                Resultado
              </div>
              <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-xl border bg-gray-50">
                <img src={state.resultImageUrl} alt="Resultado" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
