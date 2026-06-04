import type { DocumentDrawerSubview } from './DocumentDrawerView.types';
import logo from '../../../assets/logo.png';
import { documentManagementTheme } from '../documentManagementTheme';

type Props = {
  title: string;
  subtitle?: string;
  badge: string;
  subview: DocumentDrawerSubview;
  onChangeSubview: (next: DocumentDrawerSubview) => void;
  onClose: () => void;
};

export const DocumentDrawerHeader = ({
  title,
  subtitle,
  badge,
  subview,
  onChangeSubview,
  onClose,
}: Props) => (
  <div
    className="px-4 py-3 flex justify-between items-center shrink-0"
    style={{
      background: `linear-gradient(180deg, ${documentManagementTheme.panelBg} 0%, ${documentManagementTheme.panelSoftBg} 100%)`,
      borderBottom: `1px solid ${documentManagementTheme.border}`,
    }}
  >
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="inline-flex w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: documentManagementTheme.accent }} />
          <h2 className="text-lg font-black truncate" style={{ color: documentManagementTheme.text }}>{title}</h2>
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-[0.18em] border uppercase shadow-sm"
            style={{
              borderColor: '#ffd7dd',
              background: documentManagementTheme.accentBg,
              color: documentManagementTheme.accentText,
            }}
          >
            {badge}
          </span>
        </div>
        {subtitle ? (
          <div className="mt-1 text-xs font-medium" style={{ color: documentManagementTheme.muted }}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={() => onChangeSubview(subview === 'lines' ? 'document' : 'lines')}
        className="h-9 w-9 rounded-xl border transition disabled:opacity-60 flex items-center justify-center"
        style={{
          borderColor: documentManagementTheme.border,
          background: documentManagementTheme.panelBg,
          boxShadow: documentManagementTheme.shadowSoft,
        }}
        title={subview === 'lines' ? 'Volver al documento' : 'Gestionar líneas'}
        aria-label={subview === 'lines' ? 'Volver al documento' : 'Gestionar líneas'}
      >
        <img src={logo} alt="Aluon" className="h-5 w-auto object-contain" />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="text-2xl transition cursor-pointer leading-none"
        style={{ color: documentManagementTheme.muted }}
        aria-label="Cerrar"
        title="Cerrar"
      >
        ×
      </button>
    </div>
  </div>
);
