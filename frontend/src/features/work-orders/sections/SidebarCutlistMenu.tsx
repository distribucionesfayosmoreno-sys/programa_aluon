import { cardStyle, uiColors } from '../components/ui';

export const SidebarCutlistMenu = () => (
  <div className="p-6 rounded-2xl" style={cardStyle}>
    <div className="text-xs font-black uppercase tracking-widest" style={{ color: uiColors.textSubtle }}>
      Menú despieces
    </div>
    <div className="mt-4 space-y-2">
      <a className="block text-xs font-semibold uppercase tracking-widest" style={{ color: uiColors.textPrimary }} href="#cutlist-form">
        Formulario
      </a>
      <a className="block text-xs font-semibold uppercase tracking-widest" style={{ color: uiColors.textPrimary }} href="#cutlist-visual">
        Vista técnica
      </a>
      <a className="block text-xs font-semibold uppercase tracking-widest" style={{ color: uiColors.textPrimary }} href="#cutlist-table">
        Tabla de despiece
      </a>
    </div>
  </div>
);
