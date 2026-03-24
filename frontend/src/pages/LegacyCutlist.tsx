const LEGACY_DESPIECE_URL = '/legacy/aluon/index.html';

const LegacyCutlist = () => (
  <div className="relative space-y-6">
    <div
      className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-30 blur-3xl"
      style={{ background: 'radial-gradient(circle, rgba(15,23,42,0.18), rgba(15,23,42,0))' }}
    />
    <div
      className="rounded-3xl p-6 sm:p-8 text-white overflow-hidden"
      style={{
        background: 'linear-gradient(120deg, #0f172a 0%, #111827 55%, #1f2937 100%)',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
      }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black">Programa de despiece</h1>
          <p className="text-sm sm:text-base font-semibold text-slate-300/90 max-w-2xl">
            Módulo histórico integrado sin alterar su funcionamiento original, ahora dentro del nuevo panel.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 border border-white/10">
              Sin regresión
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 border border-white/10">
              Compatible legacy
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 border border-white/10">
              Ejecución aislada
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <a
            className="btn-ghost"
            href={LEGACY_DESPIECE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Abrir en pantalla completa
          </a>
        </div>
      </div>
    </div>

    <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white" style={{ boxShadow: '0 14px 30px rgba(15,23,42,0.08)' }}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Legacy Runtime</div>
        </div>
        <div className="text-xs font-semibold text-slate-400">Despiece v1</div>
      </div>
      <div style={{ height: 'calc(100vh - 320px)' }}>
        <iframe
          title="Programa de despiece legacy"
          src={LEGACY_DESPIECE_URL}
          className="w-full h-full"
        />
      </div>
    </div>
  </div>
);

export default LegacyCutlist;
