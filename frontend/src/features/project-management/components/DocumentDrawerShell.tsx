import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const DocumentDrawerShell = ({ open, onClose, children }: Props) => {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-stretch justify-stretch"
      role="dialog"
      aria-modal="true"
      aria-label="Detalle del documento"
    >
      <div
        className="absolute inset-0"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        style={{
          background: 'rgba(17,24,39,0.55)',
          backdropFilter: 'blur(6px)',
          opacity: entered ? 1 : 0,
          transition: 'opacity 220ms ease-out',
        }}
      />

      <div
        className="relative m-2 md:m-3 w-full h-full flex flex-col overflow-hidden"
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: 'none',
          height: '100%',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          boxShadow: '0 30px 80px rgba(15,23,42,0.28)',
          transform: entered ? 'translateY(0)' : 'translateY(4px)',
          opacity: entered ? 1 : 0,
          transition: 'transform 220ms ease-out, opacity 220ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
