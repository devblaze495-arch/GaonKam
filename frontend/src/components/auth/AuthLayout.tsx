import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../i18n/useLanguage'

export function AuthLayout({ children, step, onBack, showBack = true }: { children: React.ReactNode; step?: number; onBack?: () => void; showBack?: boolean }) {
  const { language, languageLabels, setLanguage, t } = useLanguage()

  return (
    <div className="auth-layout">
      <header className="auth-header">
        {showBack && onBack ? <button className="auth-back" onClick={onBack} aria-label={t('back')}>← <span>{t('back')}</span></button> : <span />}
        <NavLink to="/" className="auth-brand"><span className="brand-mark" aria-hidden="true">ग</span><strong>{t('appTitle')}</strong></NavLink>
        <label className="auth-language"><span className="sr-only">{t('changeLanguage')}</span><select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} aria-label={t('changeLanguage')}>{Object.entries(languageLabels).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
      </header>
      {step ? <div className="auth-progress" aria-label={`${step} / 5`}><span style={{ width: `${step * 20}%` }} /></div> : null}
      <main className="auth-content">{children}</main>
    </div>
  )
}
