export function Container({ className = "", children }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">{eyebrow}</p>}
        <h2 className="mt-2 text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function PageHero({ eyebrow, title, children }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <Container className="relative py-14 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {children && <div className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{children}</div>}
      </Container>
    </section>
  );
}

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-aurora active:translate-y-0";

export const lightButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-50 active:translate-y-0";

export const darkGhostButton =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white ring-1 ring-white/30 transition duration-200 hover:bg-white/10";

export const ghostButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink ring-1 ring-slate-200 transition duration-200 hover:-translate-y-0.5 hover:ring-aurora";

export const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink transition placeholder:text-slate-400 focus:border-aurora";
