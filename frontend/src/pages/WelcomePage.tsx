import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'

export function WelcomePage() {
  const navigate = useNavigate()
  const { language, setLanguage, languageLabels, t } = useLanguage()

  return (
    <div className="welcome-screen-container">
      <main className="welcome-screen">
        {/* Language selector at top right for immediate access */}
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
          <select
            className="language-selector"
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            aria-label={t('changeLanguage')}
            style={{
              background: 'rgba(255, 252, 246, 0.95)',
              border: '1px solid var(--border-medium)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            {Object.entries(languageLabels).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Top Header Branding */}
        <header className="welcome-branding">
          <div className="welcome-logo-mark" aria-hidden="true">
            <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 28C17.5 24.5 18 20.5 20.5 17.5C23.5 14 28 13 32 14C31 18.5 29 23 25.5 25.5C23 27.5 20.5 28.5 19 28Z"
                fill="#A67C52"
              />
              <path
                d="M23 29C23 29 25 19 36 10C36 10 39 23 29 32C24.5 36 18 36.5 14 34C18.5 33 21.5 31.5 23 29Z"
                fill="#4E6838"
              />
              <path
                d="M22 30C26 23 31 16 36 10"
                stroke="#FAF7F0"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="welcome-brand-name">GaavKaam</h1>
          <div className="welcome-brand-mr">गावकाम</div>
          <p className="welcome-brand-tagline">{t('welcomeBrandTagline')}</p>
        </header>

        {/* Center / Lower Content */}
        <div className="welcome-footer-content">
          {/* Main 3-line Tagline */}
          <div className="welcome-main-tagline">
            <span>{t('welcomeTagline1')}</span>
            <span>{t('welcomeTagline2')}</span>
            <span>{t('welcomeTagline3')}</span>
          </div>

          {/* Primary Terracotta CTA Button */}
          <button
            type="button"
            className="welcome-cta-btn"
            onClick={() => navigate('/login/mobile')}
            aria-label={t('getStartedAria')}
          >
            <span>{t('getStarted')}</span>
            <span className="welcome-cta-arrow" aria-hidden="true">→</span>
          </button>

          {/* Bottom localized descriptor */}
          <div className="welcome-sub-tagline">
            {t('welcomeSubTagline')}
          </div>
        </div>
      </main>
    </div>
  )
}
