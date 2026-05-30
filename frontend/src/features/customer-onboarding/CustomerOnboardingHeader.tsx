type CustomerOnboardingHeaderProps = {
  error: string;
};

export const CustomerOnboardingHeader = ({ error }: CustomerOnboardingHeaderProps) => (
  <>
    {error && (
      <div className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: 'var(--notice-bg)', color: 'var(--notice-text)', border: '1px solid var(--notice-border)' }}>
        {error}
      </div>
    )}
  </>
);
