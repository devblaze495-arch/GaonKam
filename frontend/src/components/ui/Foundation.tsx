import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import type { StatusTone } from '../../types/status'

export function Button({ variant = 'primary', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' }) {
  return <button className={`button button--${variant}`} {...props}>{children}</button>
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>
}

export function SearchInput({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="search-field">
      <span className="sr-only">{label}</span>
      <span className="search-field__icon" aria-hidden="true">⌕</span>
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
  return <span className="rating" aria-label={accessibleLabel ?? `${value} / 5`}><span aria-hidden="true">★</span> {value.toFixed(1)}</span>
}

export function TrustScore({ score, completedJobs, label, completedJobsLabel }: { score: number; completedJobs?: number; label: string; completedJobsLabel?: string }) {
  return <div className="trust-score"><div><span className="eyebrow">{label}</span><strong>{score}<small>/100</small></strong></div>{completedJobs !== undefined && completedJobsLabel ? <span className="trust-score__jobs">{completedJobs} {completedJobsLabel}</span> : null}</div>
}

export function Alert({ tone = 'info', children }: { tone?: StatusTone; children: ReactNode }) {
  return <div className={`alert alert--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}><span aria-hidden="true" className="alert__icon">{tone === 'success' ? '✓' : tone === 'danger' ? '!' : 'i'}</span><span>{children}</span></div>
}
