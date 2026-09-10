import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Input } from '../components/ui/Foundation'
import { useLanguage } from '../i18n/useLanguage'
import { useAuth } from '../auth/useAuth'

export function LoginPage() {
  const { language, setLanguage, languageLabels, t } = useLanguage()
  const { requestOtp } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone) return setError(t('mobileRequired'))
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) return setError(t('mobileInvalid'))
    setError('')
    setIsLoading(true)
    try {
      await requestOtp(cleanPhone)
      navigate('/login/otp')
    } catch {
      setError(t('authError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-view-wrapper">
      <div className="auth-card-container">
        {/* Top bar with back button & language selector */}
        <div className="auth-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <button type="button" onClick={() => navigate('/login')} className="auth-back-btn" aria-label={t('back')}>
            <ChevronLeft size={22} />
          </button>
          <select
            className="language-selector"
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            aria-label={t('changeLanguage')}
            style={{
              background: 'rgba(255, 252, 246, 0.95)',
              border: '1px solid var(--border-medium)',
              borderRadius: '20px',
              padding: '4px 10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {Object.entries(languageLabels).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Branding header */}
        <div className="auth-brand-section">
          <div className="auth-leaf-logo" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <path d="M19 28C17.5 24.5 18 20.5 20.5 17.5C23.5 14 28 13 32 14C31 18.5 29 23 25.5 25.5C23 27.5 20.5 28.5 19 28Z" fill="#A67C52" />
              <path d="M23 29C23 29 25 19 36 10C36 10 39 23 29 32C24.5 36 18 36.5 14 34C18.5 33 21.5 31.5 23 29Z" fill="#4E6838" />
              <path d="M22 30C26 23 31 16 36 10" stroke="#FAF7F0" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="auth-title">GaavKaam</h1>
          <div className="auth-marathi">गावकाम</div>
          <div className="auth-subtitle">{t('loginHeaderTagline')}</div>
        </div>

        {/* Welcome & Prompt */}
        <div className="auth-form-header">
          <h2>{t('loginWelcomeTitle')}</h2>
          <p>{t('loginEnterPhone')}</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="auth-phone-form" noValidate>
          <div className="phone-input-group">
            <div className="country-prefix">
              <span className="flag-icon" aria-hidden="true">🇮🇳</span>
              <span className="code-text">+91</span>
            </div>
            <Input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder={t('mobileNumberPlaceholder') || '98765 43210'}
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
              aria-label={t('mobileNumberLabel')}
              className="phone-field-input"
            />
          </div>

          {error && <div className="auth-error-msg">{error}</div>}

          <button type="submit" disabled={isLoading} className="auth-primary-submit-btn">
            {isLoading ? t('authLoading') : t('mobileContinue')}
          </button>
        </form>

        <p className="sms-disclaimer">{t('loginOtpNote')}</p>

        {/* Bottom Village illustration watermark & trust footer */}
        <div className="auth-village-footer">
          <div className="rural-skylight-art" aria-hidden="true">
            <svg width="220" height="70" viewBox="0 0 220 70" fill="none" opacity="0.35">
              <path d="M30 45 L50 25 L70 45 Z" fill="#DDD7CC" />
              <rect x="36" y="45" width="28" height="20" fill="#ECE7DE" />
              <path d="M80 40 L105 20 L130 40 Z" fill="#C5BCAD" />
              <rect x="88" y="40" width="36" height="25" fill="#ECE7DE" />
              <path d="M140 46 L160 30 L180 46 Z" fill="#DDD7CC" />
              <rect x="146" y="46" width="28" height="19" fill="#ECE7DE" />
              <circle cx="195" cy="22" r="14" stroke="#C5BCAD" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="195" y1="22" x2="195" y2="65" stroke="#C5BCAD" strokeWidth="2" />
            </svg>
          </div>
          <span className="trust-footer-text">{t('loginTrustedCommunities')}</span>
        </div>
      </div>
    </div>
  )
}
