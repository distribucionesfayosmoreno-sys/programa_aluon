export const SidebarCutlistMenu = () => (
  <div className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
    <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
      Menú despieces
    </div>
    <div className="mt-4 space-y-2">
      <a className="block text-xs font-semibold uppercase tracking-widest" style={{ color: '#0d1117' }} href="#cutlist-form">
        Formulario
      </a>
      <a className="block text-xs font-semibold uppercase tracking-widest" style={{ color: '#0d1117' }} href="#cutlist-visual">
        Vista técnica
      </a>
      <a className="block text-xs font-semibold uppercase tracking-widest" style={{ color: '#0d1117' }} href="#cutlist-table">
        Tabla de despiece
      </a>
    </div>
  </div>
);
