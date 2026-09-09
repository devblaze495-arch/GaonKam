import { Button } from '../ui/Foundation'
import { useLanguage } from '../../i18n/useLanguage'

export function LoadingState({ label }: { label?: string }) {
  const { t } = useLanguage()
  return <div className="state-message" role="status"><span className="spinner" aria-hidden="true" />{label ?? t('loading')}</div>
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="state-message state-message--empty"><span className="state-message__mark" aria-hidden="true">०</span><strong>{title}</strong><span>{description}</span></div>
}

export function ErrorState({ title, retryLabel, onRetry }: { title: string; retryLabel: string; onRetry: () => void }) {
  return <div className="state-message state-message--error"><strong>{title}</strong><Button variant="secondary" onClick={onRetry}>{retryLabel}</Button></div>
}
