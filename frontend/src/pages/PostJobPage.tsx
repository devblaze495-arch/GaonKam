import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { Button, Card, Field, Input, Select } from '../components/ui/Foundation'
import { useLanguage } from '../i18n/useLanguage'
import { skillOptions } from '../data/profileData'
import { jobsService } from '../services/jobsService'

export function PostJobPage() {
  const { language, t, localizeCategory, localizeWageType } = useLanguage()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('agriculture')
  const [description, setDescription] = useState('')
  const [paymentType, setPaymentType] = useState<'daily' | 'fixed'>('daily')
  const [paymentAmount, setPaymentAmount] = useState<number>(600)
  const [workersRequired, setWorkersRequired] = useState<number>(2)
  const [workDate, setWorkDate] = useState('')
  const [startTime, setStartTime] = useState('08:00')
  const [village, setVillage] = useState('')
  const [taluka] = useState('')
  const [district, setDistrict] = useState('')
  const [requiredSkillIds, setRequiredSkillIds] = useState<string[]>(['farming'])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function toggleSkill(id: string) {
    setRequiredSkillIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !description.trim() || !workDate || !village.trim() || !district.trim()) {
      return setError(t('requiredField') || 'Please fill in all required fields.')
    }
    setError('')
    setIsSubmitting(true)

    try {
      await jobsService.createJob({
        title,
        description,
        categoryId,
        requiredSkillIds,
        paymentType,
        paymentAmount: Number(paymentAmount),
        workersRequired: Number(workersRequired),
        workDate,
        startTime,
        village,
        taluka: taluka || village,
        district,
      })
      navigate('/my-jobs')
    } catch {
      setError(t('error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="find-work-page">
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <button type="button" onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))} className="icon-btn" aria-label={t('back')}>
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="find-work-title" style={{ fontSize: '1.3rem' }}>{t('postWorkTitle')}</h1>
          <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {t('postWorkSubtitle')}
          </p>
        </div>
      </div>

      {/* 3-Step Progress Indicator */}
      <div className="post-work-stepper">
        <div className="stepper-step">
          <div className={`stepper-dot ${step >= 1 ? 'is-active' : ''}`}>1</div>
          <span className="stepper-label">{t('stepJobDetails')}</span>
        </div>
        <div className={`stepper-connector ${step >= 2 ? 'is-active' : ''}`} />
        <div className="stepper-step">
          <div className={`stepper-dot ${step >= 2 ? 'is-active' : ''}`}>2</div>
          <span className="stepper-label">{t('stepSchedulePay')}</span>
        </div>
        <div className={`stepper-connector ${step >= 3 ? 'is-active' : ''}`} />
        <div className="stepper-step">
          <div className={`stepper-dot ${step >= 3 ? 'is-active' : ''}`}>3</div>
          <span className="stepper-label">{t('stepLocationSkills')}</span>
        </div>
      </div>

      {error && <div className="auth-error-msg" style={{ marginBottom: 14 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <Card style={{ display: 'grid', gap: 14 }}>
            <Field label={t('jobTitleLabel')}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('jobTitlePlaceholder')}
                required
              />
            </Field>

            <Field label={t('categoryLabel')}>
              <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="agriculture">{localizeCategory('agriculture')}</option>
                <option value="construction">{localizeCategory('construction')}</option>
                <option value="household">{localizeCategory('household')}</option>
                <option value="transport">{localizeCategory('transport')}</option>
                <option value="skilled">{localizeCategory('skilled')}</option>
                <option value="other">{localizeCategory('other')}</option>
              </Select>
            </Field>

            <Field label={t('jobDescLabel')}>
              <textarea
                className="form-control"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('jobDescPlaceholder')}
                required
              />
            </Field>

            <button
              type="button"
              className="welcome-cta-btn"
              onClick={() => {
                if (!title.trim() || !description.trim()) return setError(t('requiredField') || 'Please fill in Title and Description.')
                setError('')
                setStep(2)
              }}
              style={{ marginTop: 10 }}
            >
              <span>{t('nextStep')}</span>
              <ArrowRight size={16} />
            </button>
          </Card>
        )}

        {step === 2 && (
          <Card style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label={t('payTypeLabel')}>
                <Select value={paymentType} onChange={(e) => setPaymentType(e.target.value as any)}>
                  <option value="daily">{localizeWageType('daily')}</option>
                  <option value="fixed">{localizeWageType('fixed')}</option>
                </Select>
              </Field>

              <Field label={t('amountLabel')}>
                <Input
                  type="number"
                  min="100"
                  max="50000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  required
                />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label={t('workersNeededLabel')}>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={workersRequired}
                  onChange={(e) => setWorkersRequired(Number(e.target.value))}
                  required
                />
              </Field>

              <Field label={t('startDateLabel')}>
                <Input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} required />
              </Field>
            </div>

            <Field label={t('workTimingLabel')}>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </Field>

            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <Button variant="secondary" type="button" onClick={() => setStep(1)} style={{ flex: 1 }}>
                {t('prevStep')}
              </Button>
              <button
                type="button"
                className="welcome-cta-btn"
                onClick={() => setStep(3)}
                style={{ flex: 2 }}
              >
                <span>{t('nextStep')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label={t('workVillageLabel')}>
                <Input value={village} onChange={(e) => setVillage(e.target.value)} required />
              </Field>
              <Field label={t('workDistrictLabel')}>
                <Input value={district} onChange={(e) => setDistrict(e.target.value)} required />
              </Field>
            </div>

            <Field label={t('requiredSkillsLabel')}>
              <div className="skills-select-grid" style={{ marginTop: 4 }}>
                {skillOptions.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    className={`skill-selectable-chip ${requiredSkillIds.includes(skill.id) ? 'is-selected' : ''}`}
                    onClick={() => toggleSkill(skill.id)}
                  >
                    <span>{skill.name[language]}</span>
                    <span>{requiredSkillIds.includes(skill.id) ? '✓' : '+'}</span>
                  </button>
                ))}
              </div>
            </Field>

            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <Button variant="secondary" type="button" onClick={() => setStep(2)} style={{ flex: 1 }}>
                {t('prevStep')}
              </Button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="welcome-cta-btn"
                style={{ flex: 2 }}
              >
                {isSubmitting ? t('saving') : t('submitJob')}
              </button>
            </div>
          </Card>
        )}
      </form>
    </div>
  )
}
