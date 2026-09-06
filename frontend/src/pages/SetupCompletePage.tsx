import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Foundation'
import { useLanguage } from '../i18n/useLanguage'

export function SetupCompletePage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  return <AuthLayout showBack={false}><div className="auth-card success-card"><div className="success-mark" aria-hidden="true">✓</div><span className="eyebrow">{t('appTitle')}</span><h1>{t('successTitle')}</h1><p>{t('successDescription')}</p><Button type="button" onClick={() => navigate('/')}>{t('goToHome')} <span aria-hidden="true">→</span></Button></div></AuthLayout>
}
