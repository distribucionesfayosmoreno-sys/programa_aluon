import type { SettingsTab } from './Settings.types';

type ModuleCard = {
  key: SettingsTab;
  title: string;
  description: string;
  accent: string;
  icon: JSX.Element;
};

type SettingsModuleCardsProps = {
  cards: ModuleCard[];
  activeTab: SettingsTab;
  onSelect: (tab: SettingsTab) => void;
};

export const SettingsModuleCards = ({ cards, activeTab, onSelect }: SettingsModuleCardsProps) => (
  <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {cards.map(card => (
      <button
        key={card.key}
        type="button"
        onClick={() => onSelect(card.key)}
        className="text-left rounded-2xl p-6 transition-all duration-150"
        style={{
          background: '#ffffff',
          border: activeTab === card.key ? `1px solid ${card.accent}40` : '1px solid #e5e7eb',
          boxShadow: activeTab === card.key ? `0 18px 35px -25px ${card.accent}` : '0 8px 20px -18px rgba(15,23,42,0.3)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ border: '1px solid #eef2f7', color: card.accent, background: '#f9fafb' }}
        >
          {card.icon}
        </div>
        <div className="mt-5 text-sm font-black uppercase" style={{ color: '#0d1117' }}>
          {card.title}
        </div>
        <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
          {card.description}
        </p>
        <div className="mt-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
          Configurar módulo
        </div>
        <div className="mt-2 h-1 rounded-full" style={{ background: `${card.accent}22` }}>
          <div className="h-1 rounded-full" style={{ width: activeTab === card.key ? '40%' : '18%', background: card.accent }} />
        </div>
      </button>
    ))}
  </section>
);
