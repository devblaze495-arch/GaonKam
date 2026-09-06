import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button, Field, Input } from '../components/ui/Foundation'
import { useLanguage } from '../i18n/useLanguage'
import { useAuth } from '../auth/useAuth'

export function LoginPage() {
  const { t } = useLanguage()
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

  return <AuthLayout showBack={false}><div className="auth-card"><div className="auth-card__intro"><div className="onboarding-icon" aria-hidden="true">ग</div><span className="eyebrow">{t('appTitle')}</span><h1>{t('loginTitle')}</h1><p>{t('loginDescription')}</p></div><form className="auth-form" onSubmit={submit} noValidate><Field label={t('mobileNumber')} error={error}><div className="phone-input"><span aria-hidden="true">+91</span><Input type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder={t('mobileNumberPlaceholder')} value={phone} onChange={(event) => { setPhone(event.target.value.replace(/\D/g, '')); setError('') }} aria-invalid={Boolean(error)} /></div></Field><Button type="submit" disabled={isLoading}>{isLoading ? t('authLoading') : t('mobileContinue')} <span aria-hidden="true">→</span></Button></form></div></AuthLayout>
}
