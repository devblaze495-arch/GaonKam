import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Foundation'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import type { UserIntent } from '../types/auth'

const intents: { id: UserIntent; key: 'findWorkIntent' | 'postWorkIntent' | 'findServiceIntent' | 'offerServiceIntent'; icon: string }[] = [
  { id: 'find-work', key: 'findWorkIntent', icon: '↗' },
  { id: 'post-work', key: 'postWorkIntent', icon: '+' },
  { id: 'find-service', key: 'findServiceIntent', icon: '⌕' },
  { id: 'offer-service', key: 'offerServiceIntent', icon: '✦' },
]

export function IntentSetupPage() {
  const { t } = useLanguage()
  const { user, updateIntents } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<UserIntent[]>(user?.intents ?? [])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function toggle(intent: UserIntent) {
    setSelected((current) => current.includes(intent) ? current.filter((item) => item !== intent) : [...current, intent])
    setError('')
  }

  async function submit() {
    if (!selected.length) return setError(t('intentRequired'))
    setIsLoading(true)
    try { await updateIntents(selected); navigate('/setup-complete') } catch { setError(t('authError')) } finally { setIsLoading(false) }
  }

  return <AuthLayout step={2} onBack={() => navigate('/setup-profile')}><div className="auth-card auth-card--wide"><div className="auth-card__intro"><span className="eyebrow">{t('appTitle')}</span><h1>{t('intentTitle')}</h1><p>{t('intentDescription')}</p></div><div className="intent-list">{intents.map((intent) => <button className={`intent-option ${selected.includes(intent.id) ? 'is-selected' : ''}`} key={intent.id} type="button" onClick={() => toggle(intent.id)} aria-pressed={selected.includes(intent.id)}><span className="intent-option__icon" aria-hidden="true">{intent.icon}</span><span>{t(intent.key)}</span><span className="intent-option__check" aria-hidden="true">{selected.includes(intent.id) ? '✓' : ''}</span></button>)}</div><p className="form-hint">{t('intentHint')}</p>{error ? <p className="form-field__error" role="alert">{error}</p> : null}<Button type="button" disabled={isLoading} onClick={submit}>{isLoading ? t('authLoading') : t('finishSetup')} <span aria-hidden="true">→</span></Button></div></AuthLayout>
}
