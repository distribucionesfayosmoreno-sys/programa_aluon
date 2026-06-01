import type { DocumentDrawerSubview } from './DocumentDrawerView.types';
import logo from '../../../assets/logo.png';

type Props = {
  title: string;
  badge: string;
  subview: DocumentDrawerSubview;
  onChangeSubview: (next: DocumentDrawerSubview) => void;
  onClose: () => void;
};

export const DocumentDrawerHeader = ({
  title,
  badge,
  subview,
  onChangeSubview,
  onClose,
}: Props) => (
  <div
    className="px-4 py-3 flex justify-between items-center shrink-0"
    style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}
  >
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#64748b' }} />
          <h2 className="text-lg font-bold truncate" style={{ color: '#0f172a' }}>{title}</h2>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider border uppercase shadow-sm"
            style={{ borderColor: '#cbd5e1', background: '#f1f5f9', color: '#475569' }}
          >
            {badge}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={() => onChangeSubview(subview === 'lines' ? 'document' : 'lines')}
        className="h-9 w-9 rounded-md border transition disabled:opacity-60 flex items-center justify-center"
        style={{ borderColor: '#e5e7eb', background: '#ffffff' }}
        title={subview === 'lines' ? 'Volver al documento' : 'Gestionar líneas'}
        aria-label={subview === 'lines' ? 'Volver al documento' : 'Gestionar líneas'}
      >
        <img src={logo} alt="Aluon" className="h-5 w-auto object-contain invert" />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="text-2xl transition cursor-pointer leading-none"
        style={{ color: '#94a3b8' }}
        aria-label="Cerrar"
        title="Cerrar"
      >
        ×
      </button>
    </div>
  </div>
);
