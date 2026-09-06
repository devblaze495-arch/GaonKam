type LandingHeroProps = {
  t: Record<string, string>
}

export function LandingHero({ t }: LandingHeroProps) {
  return (
    <section className="grid gap-10 rounded-3xl border border-emerald-200 bg-white/80 p-8 shadow-lg shadow-emerald-100 backdrop-blur-sm lg:grid-cols-[1.3fr_0.7fr] lg:p-12">
      <div className="space-y-6">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          {t.appTitle}
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            {t.headline}
          </h1>
          <p className="max-w-xl text-lg text-slate-600">{t.subheadline}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="rounded-xl bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            {t.primaryCta}
          </button>
          <button className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
            {t.secondaryCta}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-6 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">{t.statsTitle}</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[
            ['24/7', t.local],
            ['Jobs', t.jobs],
            ['Services', t.services],
            ['Trust', t.trust],
          ].map(([value, label]) => (
            <div key={label} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{value}</div>
              <div className="mt-1 text-sm text-emerald-50">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
