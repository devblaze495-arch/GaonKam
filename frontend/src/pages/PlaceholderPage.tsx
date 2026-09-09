import { useLocation } from 'react-router-dom'
import { EmptyState } from '../components/states/AsyncStates'
import { useLanguage } from '../i18n/useLanguage'

export function PlaceholderPage() {
  const { t } = useLanguage()
  const location = useLocation()
  const title = location.pathname === '/jobs' ? t('jobs') : location.pathname === '/services' ? t('services') : t('profile')

  return <section className="page-section"><div className="section-heading"><div><span className="eyebrow">{t('appTitle')}</span><h1>{title}</h1></div></div><EmptyState title={t('emptyTitle')} description={t('emptyDescription')} /></section>
}
