import React from 'react';

type Props = {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export const AccordionSection = ({ title, description, defaultOpen = true, children }: Props) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <section
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid #eef2f7', background: '#ffffff' }}
    >
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
        style={{ background: '#ffffff' }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold truncate" style={{ color: '#0f172a' }}>
            {title}
          </div>
          {description ? (
            <div className="text-[8px] font-medium mt-0.5 truncate" style={{ color: '#94a3b8' }}>
              {description}
            </div>
          ) : null}
        </div>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ border: '1px solid #eef2f7', color: '#64748b', background: '#ffffff' }}
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 160ms ease' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open ? <div className="px-4 pb-4 pt-1">{children}</div> : null}
    </section>
  );
};
