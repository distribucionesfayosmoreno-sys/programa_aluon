type CustomerOnboardingHeaderProps = {
  error: string;
};

export const CustomerOnboardingHeader = ({ error }: CustomerOnboardingHeaderProps) => (
  <>
    <div className="flex items-center gap-2">
      <div className="w-1 h-5 rounded-full bg-brand" />
      <div>
        <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: '#0d1117' }}>Registro de Clientes</h1>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>Onboarding · Presupuestos</p>
      </div>
    </div>

    {error && (
      <div className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: 'var(--notice-bg)', color: 'var(--notice-text)', border: '1px solid var(--notice-border)' }}>
        {error}
      </div>
    )}
  </>
);
