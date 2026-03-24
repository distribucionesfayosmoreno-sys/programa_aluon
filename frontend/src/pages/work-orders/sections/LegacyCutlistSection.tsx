import { cardStyle, SectionTitle } from '../components/ui';

const LEGACY_DESPIECE_URL = '/legacy/aluon/index.html';

export const LegacyCutlistSection = () => (
  <section className="p-6 rounded-2xl mt-8" style={cardStyle}>
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <SectionTitle n="07" label="Programa de despiece (Legacy)" />
      <a
        className="btn-ghost"
        href={LEGACY_DESPIECE_URL}
        target="_blank"
        rel="noreferrer"
      >
        Abrir en pantalla completa
      </a>
    </div>
    <p className="text-xs font-semibold text-slate-500 mt-2">
      Este módulo se ejecuta en modo legacy para mantener el flujo histórico de despiece.
    </p>
    <div className="mt-4 rounded-xl overflow-hidden border border-slate-200" style={{ height: 900 }}>
      <iframe
        title="Programa de despiece legacy"
        src={LEGACY_DESPIECE_URL}
        className="w-full h-full"
      />
    </div>
  </section>
);
