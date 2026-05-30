import { dashboardTheme } from '../dashboardTheme';

type NavItem = { id: 'dashboard' | 'accounts' | 'categories' | 'operations'; label: string };

const items: NavItem[] = [
  { id: 'dashboard', label: 'Panel' },
  { id: 'accounts', label: 'Cuentas' },
  { id: 'categories', label: 'Categorías' },
  { id: 'operations', label: 'Operaciones' },
];

type Props = {
  active: NavItem['id'];
  onChange?: (id: NavItem['id']) => void;
};

export const DashboardTopNav = ({ active, onChange }: Props) => {
  return (
    <nav className="flex items-center gap-7">
      {items.map(item => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            className="relative text-[13px] font-medium leading-none transition-colors"
            style={{ color: isActive ? dashboardTheme.text : '#98a2b3' }}
            onClick={() => onChange?.(item.id)}
          >
            {item.label}
            {isActive ? (
              <span
                className="absolute -bottom-3 left-0 h-[2px] w-12 rounded-full"
                style={{ backgroundColor: dashboardTheme.tab.active }}
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
};
