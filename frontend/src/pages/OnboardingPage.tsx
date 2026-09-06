import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button, Select } from '../components/ui/Foundation'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import type { LanguageCode } from '../i18n/translations'

const steps = [
  { title: 'onboardingWelcomeTitle' as const, description: 'onboardingWelcomeDescription' as const, icon: 'ग' },
  { title: 'onboardingFindWorkTitle' as const, description: 'onboardingFindWorkDescription' as const, icon: '↗' },
  { title: 'onboardingPostWorkTitle' as const, description: 'onboardingPostWorkDescription' as const, icon: '+' },
  { title: 'onboardingServicesTitle' as const, description: 'onboardingServicesDescription' as const, icon: '✦' },
]

export function OnboardingPage() {
  const { language, languageLabels, setLanguage, t } = useLanguage()
  const { markOnboardingComplete } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  async function finish() {
    setIsSaving(true)
    await markOnboardingComplete()
    navigate('/login')
  }

  const languageStep = step === steps.length
  const content = languageStep ? null : steps[step]

  return (
    <AuthLayout step={step + 1} showBack={step > 0} onBack={() => setStep((current) => Math.max(0, current - 1))}>
      <div className="onboarding-screen">
        {content ? <><div className="onboarding-icon" aria-hidden="true">{content.icon}</div><span className="eyebrow">{t('appTagline')}</span><h1>{t(content.title)}</h1><p>{t(content.description)}</p></> : <><div className="onboarding-icon" aria-hidden="true">अ</div><span className="eyebrow">{t('appTitle')}</span><h1>{t('onboardingLanguageTitle')}</h1><p>{t('onboardingLanguageDescription')}</p><label className="language-choice"><span>{t('chooseLanguage')}</span><Select value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)}>{Object.entries(languageLabels).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</Select></label></>}
        <div className="auth-actions"><Button type="button" disabled={isSaving} onClick={() => languageStep ? finish() : setStep((current) => current + 1)}>{isSaving ? t('authLoading') : t('continue')} <span aria-hidden="true">→</span></Button>{step > 0 && !languageStep && <button className="text-button" type="button" onClick={() => setStep(steps.length)}>{t('skip')}</button>}</div>
      </div>
    </AuthLayout>
  )
}
