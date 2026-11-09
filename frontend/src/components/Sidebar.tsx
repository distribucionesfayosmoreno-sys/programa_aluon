import logo from '../assets/logo.png';
import { canAccessCutlist, type StaffUser } from '../services/staffAuthApi';

export type ModuleKey =
  | 'dashboard'
  | 'clientes'
  | 'gestion-documentos'
  | 'simulacion-puertas'
  | 'presupuestos'
  | 'configurador'
  | 'inscripciones'
  | 'ordenes'
  | 'despiece'
  | 'ajustes'
  | 'administracion';

interface NavItemProps {
  label: string;
  active?: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface SidebarProps {
  activeModule: ModuleKey;
  onSelect: (module: ModuleKey) => void;
  onNewOrder?: () => void;
  isOpen?: boolean;
  onHoverChange?: (open: boolean) => void;
  staffUser?: StaffUser | null;
  onLogout?: () => void;
}

const NavItem = ({ label, active, icon, onClick }: NavItemProps) => (
  <button type="button" onClick={onClick} className={`nav-item ${active ? 'nav-item-active' : ''}`}>
    <span className={`icon-box ${active ? 'icon-box-active' : ''}`}>{icon}</span>
    {label}
  </button>
);

const Sidebar = ({ activeModule, onSelect, onNewOrder, isOpen = true, onHoverChange, staffUser, onLogout }: SidebarProps) => (
  <aside
    className={`app-sidebar min-h-screen flex flex-col flex-shrink-0 overflow-hidden transition-[width] duration-300 ${isOpen ? 'is-open w-64' : 'is-closed w-0'}`}
    style={{ background: 'linear-gradient(180deg,#0d1117 0%,#161b22 100%)', boxShadow: '4px 0 24px rgba(0,0,0,0.22)' }}
    onMouseEnter={() => onHoverChange?.(true)}
    onMouseLeave={() => onHoverChange?.(false)}
  >
    <div className={`flex min-h-screen flex-col transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Logo */}
      <div className="px-5 py-6" style={{ borderBottom: '1px solid #21262d' }}>
        <div className="h-14 flex items-center justify-center">
          <img src={logo} alt="Aluon" className="max-h-[55px] w-auto object-contain brightness-110" />
        </div>
      </div>

      {/* Workspace label */}
      <div className="px-4 pt-6 pb-1">
        <span style={{ color: '#484f58', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em' }}>Workspace</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="sidebar-group-label">Principal</div>
        <NavItem label="Dashboard" active={activeModule === 'dashboard'} onClick={() => onSelect('dashboard')} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        } />
        <NavItem label="Clientes (CRM)" active={activeModule === 'clientes'} onClick={() => onSelect('clientes')} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        } />
        <NavItem label="Gestión Documentos" active={activeModule === 'gestion-documentos'} onClick={() => onSelect('gestion-documentos')} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        } />
        <NavItem label="Simulación Puertas" active={activeModule === 'simulacion-puertas'} onClick={() => onSelect('simulacion-puertas')} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21V3a1 1 0 011-1h6a1 1 0 011 1v18M8 12h8" />
          </svg>
        } />
        <NavItem label="Presupuestos" active={activeModule === 'presupuestos'} onClick={() => onSelect('presupuestos')} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m-6 4h6m-6 4h6M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        } />
        <div className="sidebar-group-label sidebar-group-label-spaced">Operaciones</div>
        <NavItem label="Inscripciones" active={activeModule === 'inscripciones'} onClick={() => onSelect('inscripciones')} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        } />
        <NavItem label="Órdenes de trabajo" active={activeModule === 'ordenes'} onClick={() => onSelect('ordenes')} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        } />
        {canAccessCutlist(staffUser) && <NavItem label="Despiece" active={activeModule === 'despiece'} onClick={() => onSelect('despiece')} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6m-6 4h6m-6 4h6m-6 4h6M5 5h.01M5 9h.01M5 13h.01M5 17h.01" />
          </svg>
        } />}

        <div className="sidebar-group-label sidebar-group-label-spaced">Sistema</div>
        <NavItem label="Ajustes" active={activeModule === 'ajustes'} onClick={() => onSelect('ajustes')} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        } />
        <NavItem label="Administración" active={activeModule === 'administracion'} onClick={() => onSelect('administracion')} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        } />
      </nav>

      {/* Primary action */}
      <div className="border-t border-[#21262d] p-3">
        <button
          className="btn-primary w-full justify-center text-xs tracking-widest py-3 rounded-xl"
          onClick={() => (onNewOrder ? onNewOrder() : onSelect('ordenes'))}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          NUEVA ORDEN
        </button>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#21262d] bg-[#161b22] p-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[10px] font-black text-white">
            {staffUser ? `${staffUser.nombre?.[0] || ''}${staffUser.apellidos?.[0] || ''}` : 'LO'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[10px] font-black uppercase text-[#f0f6fc]">{staffUser ? `${staffUser.nombre} ${staffUser.apellidos}` : 'Modo local'}</div>
            <div className="truncate text-[9px] font-semibold uppercase tracking-wide text-[#8b949e]">{staffUser?.role || 'Sin sesión'}</div>
          </div>
          {staffUser && onLogout && (
            <button type="button" onClick={onLogout} className="sidebar-logout-button" aria-label="Cerrar sesión" title="Cerrar sesión">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4m-5-4l5-5m0 0l-5-5m5 5H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;
