import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button, Field, Input } from '../components/ui/Foundation'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import { authService } from '../services/authService'

export function OtpPage() {
  const { t } = useLanguage()
  const { verifyOtp, requestOtp } = useAuth()
  const navigate = useNavigate()
  const [phone] = useState(() => authService.getPendingPhone())
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    if (!phone) navigate('/login', { replace: true })
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [navigate, phone])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\d{6}$/.test(otp)) return setError(otp ? t('otpInvalid') : t('otpRequired'))
    setError('')
    setIsLoading(true)
    try {
      await verifyOtp(phone, otp)
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
    try { await requestOtp(phone); setSeconds(30); setError('') } catch { setError(t('authError')) } finally { setIsLoading(false) }
  }

  return <AuthLayout onBack={() => navigate('/login')}><div className="auth-card"><div className="auth-card__intro"><div className="onboarding-icon" aria-hidden="true">✓</div><span className="eyebrow">{t('otpSentTo')}</span><h1>{t('otpTitle')}</h1><p>{t('otpDescription')} <strong>+91 {phone}</strong></p></div><form className="auth-form" onSubmit={submit} noValidate><Field label={t('otpPlaceholder')} error={error}><Input className="otp-input" type="tel" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '')); setError('') }} aria-invalid={Boolean(error)} autoFocus /></Field><Button type="submit" disabled={isLoading}>{isLoading ? t('authLoading') : t('verifyOtp')} <span aria-hidden="true">→</span></Button></form><div className="otp-actions"><button className="text-button" type="button" onClick={() => navigate('/login')}>{t('changeNumber')}</button><button className="text-button" type="button" disabled={seconds > 0 || isLoading} onClick={resend}>{seconds > 0 ? `${t('resendIn')} 00:${String(seconds).padStart(2, '0')}` : t('resendOtp')}</button></div></div></AuthLayout>
}
