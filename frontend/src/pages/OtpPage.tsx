import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Lock } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import { authService } from '../services/authService'

export function OtpPage() {
  const { t, language, setLanguage, languageLabels } = useLanguage()
  const { verifyOtp, requestOtp } = useAuth()
  const navigate = useNavigate()
  const [phone] = useState(() => authService.getPendingPhone())
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [seconds, setSeconds] = useState(28)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!phone) navigate('/login', { replace: true })
    const timer = window.setInterval(() => setSeconds((c) => Math.max(0, c - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [navigate, phone])

  function handleDigitChange(idx: number, val: string) {
    const char = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = char
    setDigits(next)
    setError('')
    if (char && idx < 5) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const otpCode = digits.join('')
    if (!/^\d{6}$/.test(otpCode)) return setError(t('otpRequired'))
    setError('')
    setIsLoading(true)
    try {
      await verifyOtp(phone, otpCode)
      navigate('/setup-profile')
    } catch {
      setError(t('otpInvalid'))
    } finally {
      setIsLoading(false)
    }
  }

  async function resend() {
    if (seconds > 0 || !phone) return
    setIsLoading(true)
    try {
      await requestOtp(phone)
      setSeconds(30)
      setError('')
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
          <button type="button" onClick={() => navigate('/login/mobile')} className="auth-back-btn" aria-label={t('back')}>
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

        {/* Brand logo at top */}
        <div className="auth-brand-section" style={{ marginBottom: 32 }}>
          <div className="auth-leaf-logo" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <path d="M19 28C17.5 24.5 18 20.5 20.5 17.5C23.5 14 28 13 32 14C31 18.5 29 23 25.5 25.5C23 27.5 20.5 28.5 19 28Z" fill="#A67C52" />
              <path d="M23 29C23 29 25 19 36 10C36 10 39 23 29 32C24.5 36 18 36.5 14 34C18.5 33 21.5 31.5 23 29Z" fill="#4E6838" />
              <path d="M22 30C26 23 31 16 36 10" stroke="#FAF7F0" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="auth-title" style={{ fontSize: '1.4rem' }}>GaavKaam</h1>
        </div>

        {/* Title and Phone message */}
        <div className="auth-form-header" style={{ textAlign: 'left', width: '100%', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700 }}>{t('otpTitle')}</h2>
          <p style={{ fontSize: '0.85rem', color: '#54656F', margin: '4px 0 0' }}>
            {t('otpDescription')}<br />
            <strong style={{ color: '#10212A' }}>+91 {phone}</strong>
          </p>
        </div>

        {/* 6-box OTP input grid */}
        <form onSubmit={submit} style={{ width: '100%' }}>
          <div className="otp-digit-boxes">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el }}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="otp-single-box"
                autoFocus={idx === 0}
                aria-label={`Digit ${idx + 1}`}
              />
            ))}
          </div>

          {error && <div className="auth-error-msg" style={{ marginTop: 12 }}>{error}</div>}

          <div className="otp-resend-row">
            <span>{t('didntReceiveCode')} </span>
            {seconds > 0 ? (
              <span className="resend-countdown">{t('resendCodeIn')} 00:{String(seconds).padStart(2, '0')}</span>
            ) : (
              <button type="button" onClick={resend} className="resend-link-btn" disabled={isLoading}>
                {t('resendOtp')}
              </button>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="auth-primary-submit-btn" style={{ marginTop: 24 }}>
            {isLoading ? t('authLoading') : t('verifyOtp')}
          </button>
        </form>

        {/* Bottom security assurance */}
        <div className="auth-security-footer">
          <Lock size={14} color="#54656F" />
          <span>{t('otpSecurityTagline')}</span>
        </div>
      </div>
    </div>
  )
}
