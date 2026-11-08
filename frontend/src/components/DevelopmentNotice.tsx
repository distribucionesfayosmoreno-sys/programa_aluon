const DevelopmentNotice = () => (
  <section
    className="flex min-h-full w-full items-center justify-center p-4 sm:p-8"
    aria-labelledby="development-notice-title"
  >
    <div className="relative w-full overflow-hidden rounded-[1.35rem] border border-[#2b8bc4] bg-gradient-to-br from-[#0e4e78] via-[#17618e] to-[#0a3f67] px-5 py-8 text-[#edf8ff] shadow-[0_18px_45px_rgba(8,55,91,0.18)] sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute inset-3 rounded-[1rem] border border-[#53a9d6]/60" />
      <div className="relative">
        <div className="mb-8 flex gap-2 px-1" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2c91ca]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2c91ca]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2c91ca]" />
        </div>

        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <svg viewBox="0 0 160 130" className="h-32 w-40 text-[#e9f6fd]" fill="none" aria-hidden="true">
            <rect x="22" y="13" width="116" height="78" rx="13" stroke="currentColor" strokeWidth="6" />
            <path d="M51 70V53M80 70V39M109 70V47" stroke="currentColor" strokeLinecap="round" strokeWidth="7" />
            <path d="M80 92v23M62 119h36" stroke="currentColor" strokeLinecap="round" strokeWidth="6" />
          </svg>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a9d8ee]">Inscripciones</p>
          <h1 id="development-notice-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            En desarrollo
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#d3eaf6] sm:text-base">
            Esta sección estará disponible cuando finalicemos la aplicación móvil. Estamos preparando todo para que funcione de forma coordinada.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default DevelopmentNotice;
