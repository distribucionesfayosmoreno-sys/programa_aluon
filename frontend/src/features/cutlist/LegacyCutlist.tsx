const LEGACY_DESPIECE_URL = '/legacy/aluon/index.html';

const LegacyCutlist = () => (
  <div className="relative space-y-6">
    <div
      className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-30 blur-3xl"
      style={{ background: 'radial-gradient(circle, rgba(15,23,42,0.18), rgba(15,23,42,0))' }}
    />
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
