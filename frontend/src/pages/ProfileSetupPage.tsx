import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button, Field, Input, Select } from '../components/ui/Foundation'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import type { LanguageCode } from '../i18n/translations'

export function ProfileSetupPage() {
  const { language, languageLabels, setLanguage, t } = useLanguage()
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', village: '', taluka: '', district: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!form.fullName.trim()) nextErrors.fullName = t('nameRequired')
    else if (form.fullName.trim().length < 2) nextErrors.fullName = t('nameTooShort')
    if (!form.village.trim()) nextErrors.village = t('villageRequired')
    if (!form.taluka.trim()) nextErrors.taluka = t('talukaRequired')
    if (!form.district.trim()) nextErrors.district = t('districtRequired')
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    if (!user) return
    setIsLoading(true)
    try { await updateProfile({ ...form, fullName: { original: form.fullName, en: language === 'en' ? form.fullName : undefined }, preferredLanguage: language }); navigate('/setup-intent') } catch { setErrors({ form: t('authError') }) } finally { setIsLoading(false) }
  }

  return <AuthLayout step={1} onBack={() => navigate('/login')}><div className="auth-card auth-card--wide"><div className="auth-card__intro"><span className="eyebrow">{t('appTitle')}</span><h1>{t('profileSetupTitle')}</h1><p>{t('profileSetupDescription')}</p></div><form className="auth-form profile-form" onSubmit={submit} noValidate><Field label={t('fullName')} error={errors.fullName}><Input autoComplete="name" placeholder={t('fullNamePlaceholder')} value={form.fullName} onChange={(event) => update('fullName', event.target.value)} aria-invalid={Boolean(errors.fullName)} /></Field><div className="form-grid"><Field label={t('village')} error={errors.village}><Input autoComplete="address-level3" placeholder={t('villagePlaceholder')} value={form.village} onChange={(event) => update('village', event.target.value)} aria-invalid={Boolean(errors.village)} /></Field><Field label={t('taluka')} error={errors.taluka}><Input placeholder={t('talukaPlaceholder')} value={form.taluka} onChange={(event) => update('taluka', event.target.value)} aria-invalid={Boolean(errors.taluka)} /></Field></div><Field label={t('district')} error={errors.district}><Input autoComplete="address-level2" placeholder={t('districtPlaceholder')} value={form.district} onChange={(event) => update('district', event.target.value)} aria-invalid={Boolean(errors.district)} /></Field><Field label={t('chooseLanguage')}><Select value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)}>{Object.entries(languageLabels).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</Select></Field>{errors.form ? <p className="form-field__error" role="alert">{errors.form}</p> : null}<Button type="submit" disabled={isLoading}>{isLoading ? t('authLoading') : t('saveContinue')} <span aria-hidden="true">→</span></Button></form></div></AuthLayout>
}
