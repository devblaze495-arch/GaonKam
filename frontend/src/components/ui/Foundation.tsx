import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import type { StatusTone } from '../../types/status'

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' | 'danger' }) {
  return <button className={`button button--${variant} ${className}`} {...props}>{children}</button>
}

export function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <section className={`card ${className}`} style={style}>{children}</section>
}

export function PageHeader({ title, subtitle, backUrl, action }: { title: string; subtitle?: string; backUrl?: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <div className="page-header__left">
        {backUrl && (
          <a href={backUrl} className="back-link">
            ←
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
      <span className="search-field__icon" aria-hidden="true">🔍</span>
      <input {...props} />
    </label>
  )
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="form-field"><span>{label}</span>{children}{error ? <small className="form-field__error" role="alert">{error}</small> : null}</label>
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="form-control" {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="form-control" {...props} />
}

export function StatusBadge({ label, tone = 'info' }: { label: string; tone?: StatusTone }) {
  return <span className={`status-badge status-badge--${tone}`}><span aria-hidden="true" className="status-badge__dot" />{label}</span>
}

export function Rating({ value, accessibleLabel }: { value: number; accessibleLabel?: string }) {
  return <span className="rating" aria-label={accessibleLabel ?? `${value} / 5`}>⭐ {value.toFixed(1)}</span>
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
          ★
        </button>
      ))}
    </div>
  )
}

export function TrustScore({ score, completedJobs, label, completedJobsLabel }: { score: number; completedJobs?: number; label: string; completedJobsLabel?: string }) {
  return <div className="trust-score"><div><span className="eyebrow">{label}</span><strong>{score}<small>/100</small></strong></div>{completedJobs !== undefined && completedJobsLabel ? <span className="trust-score__jobs">{completedJobs} {completedJobsLabel}</span> : null}</div>
}

export function Alert({ tone = 'info', children }: { tone?: StatusTone; children: ReactNode }) {
  return <div className={`alert alert--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}><span aria-hidden="true" className="alert__icon">{tone === 'success' ? '✓' : tone === 'danger' ? '!' : 'i'}</span><span>{children}</span></div>
}

export function ConfirmDialog({ title, text, onConfirm, onCancel, confirmLabel, cancelLabel }: { title: string; text: string; onConfirm: () => void; onCancel: () => void; confirmLabel?: string; cancelLabel?: string }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{text}</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel || 'Cancel'}</Button>
          <Button onClick={onConfirm}>{confirmLabel || 'Confirm'}</Button>
        </div>
      </div>
    </div>
  )
}
