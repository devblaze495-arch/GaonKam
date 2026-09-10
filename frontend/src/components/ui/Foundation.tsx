import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { AlertCircle, CheckCircle2, ChevronLeft, Info, Search, Star } from 'lucide-react'
import type { StatusTone } from '../../types/status'
import { useLanguage } from '../../i18n/useLanguage'

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' | 'danger' }) {
  return <button className={`button button--${variant} ${className}`} {...props}>{children}</button>
}

export function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <section className={`card ${className}`} style={style}>{children}</section>
}

export function PageHeader({ title, subtitle, backUrl, action }: { title: string; subtitle?: string; backUrl?: string; action?: ReactNode }) {
  const { t } = useLanguage()
  return (
    <div className="page-header">
      <div className="page-header__left">
        {backUrl && (
          <a href={backUrl} className="icon-btn" aria-label={t('back')}>
            <ChevronLeft size={20} />
          </a>
        )}
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="page-header__action">{action}</div>}
    </div>
  )
}

export function SearchInput({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="search-field">
      <span className="sr-only">{label}</span>
      <span className="search-field__icon" aria-hidden="true">
        <Search size={18} />
      </span>
      <input {...props} />
    </label>
  )
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {error ? <small className="form-field__error" role="alert">{error}</small> : null}
    </label>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="form-control" {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="form-control" {...props} />
}

export function StatusBadge({ label, tone = 'info' }: { label: string; tone?: StatusTone }) {
  return (
    <span className={`status-badge status-badge--${tone}`}>
      <span aria-hidden="true" className="status-badge__dot" />
      {label}
    </span>
  )
}

export function Rating({ value, accessibleLabel }: { value: number; accessibleLabel?: string }) {
  const { t } = useLanguage()
  return (
    <span className="rating" aria-label={accessibleLabel ?? `${value} / 5`}>
      <Star size={15} fill="#D97706" color="#D97706" /> {value ? value.toFixed(1) : t('newLabel')}
    </span>
  )
}

export function StarRating({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  return (
    <div className="star-rating-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-button ${star <= value ? 'is-active' : ''}`}
          onClick={() => onChange(star)}
          aria-label={`${star} stars`}
        >
          <Star size={24} fill={star <= value ? '#D97706' : 'none'} color={star <= value ? '#D97706' : '#DDD7CC'} />
        </button>
      ))}
    </div>
  )
}

export function TrustScore({ score, completedJobs, label, completedJobsLabel }: { score: number; completedJobs?: number; label: string; completedJobsLabel?: string }) {
  return (
    <div className="trust-score">
      <div>
        <span className="eyebrow">{label}</span>
        <div>
          <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{score}</strong>
          <small style={{ color: 'var(--text-muted)' }}>/100</small>
        </div>
      </div>
      {completedJobs !== undefined && completedJobsLabel ? (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {completedJobs} {completedJobsLabel}
        </span>
      ) : null}
    </div>
  )
}

export function Alert({ tone = 'info', children }: { tone?: StatusTone; children: ReactNode }) {
  const IconComponent = tone === 'success' ? CheckCircle2 : tone === 'danger' ? AlertCircle : Info
  return (
    <div className={`status-badge status-badge--${tone}`} style={{ padding: '10px 14px', width: '100%', borderRadius: 'var(--radius-sm)' }} role={tone === 'danger' ? 'alert' : 'status'}>
      <IconComponent size={18} />
      <span>{children}</span>
    </div>
  )
}

export function ConfirmDialog({ title, text, onConfirm, onCancel, confirmLabel, cancelLabel }: { title: string; text: string; onConfirm: () => void; onCancel: () => void; confirmLabel?: string; cancelLabel?: string }) {
  const { t } = useLanguage()
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem' }}>{title}</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel || t('cancel')}</Button>
          <Button onClick={onConfirm}>{confirmLabel || t('confirm')}</Button>
        </div>
      </div>
    </div>
  )
}
