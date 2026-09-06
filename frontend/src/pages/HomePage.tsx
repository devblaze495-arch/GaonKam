import { LandingHero } from '../components/LandingHero'
import { translations, type LanguageCode } from '../i18n/translations'

const lang: LanguageCode = 'mr'
const t = translations[lang]

export function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between rounded-2xl border border-emerald-100 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
              G
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{t.appTitle}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rural workforce</p>
            </div>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
            {lang.toUpperCase()}
          </div>
        </header>

        <LandingHero t={t} />
      </div>
    </main>
  )
}
