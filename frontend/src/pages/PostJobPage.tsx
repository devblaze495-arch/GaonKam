import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Field, Input, PageHeader, Select } from '../components/ui/Foundation'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import { jobsService } from '../services/jobsService'
import { skillOptions } from '../data/profileData'

export function PostJobPage() {
  const { user } = useAuth()
  const { language, t } = useLanguage()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('agriculture')
  const [requiredSkillIds, setRequiredSkillIds] = useState<string[]>([])
  const [paymentType, setPaymentType] = useState<'daily' | 'fixed'>('daily')
  const [paymentAmount, setPaymentAmount] = useState(600)
  const [workersRequired, setWorkersRequired] = useState(2)
  const [workDate, setWorkDate] = useState('2026-09-12')
  const [startTime, setStartTime] = useState('08:00')
  const [village, setVillage] = useState(user?.profile?.village || '')
  const [taluka, setTaluka] = useState(user?.profile?.taluka || '')
  const [district, setDistrict] = useState(user?.profile?.district || '')

  function toggleSkill(skillId: string) {
    setRequiredSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !village.trim()) {
      return setError(t('profileEmpty'))
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
        taluka,
        district,
      })
      navigate('/my-jobs')
    } catch {
      setError(t('saveError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-section">
      <PageHeader title={t('postWorkTitle')} subtitle={t('postWorkSubtitle')} />

      <div className="step-indicator">
        <div className={`step-dot ${step >= 1 ? 'is-active' : ''}`} />
        <div className={`step-dot ${step >= 2 ? 'is-active' : ''}`} />
        <div className={`step-dot ${step >= 3 ? 'is-active' : ''}`} />
      </div>

      {error && <Alert tone="danger">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <Card>
            <Field label={t('jobTitleLabel')}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('jobTitlePlaceholder')}
                required
              />
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

            <Field label={t('jobCategoryLabel')}>
              <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="agriculture">कृषी कामे (Agriculture)</option>
                <option value="construction">बांधकाम कामे (Construction)</option>
                <option value="household">घरगुती कामे (Household)</option>
                <option value="transport">वाहतूक / हमाली (Transport)</option>
                <option value="other">इतर (Other)</option>
              </Select>
            </Field>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <Button type="button" onClick={() => setStep(2)}>
                {t('next')} →
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <div className="profile-form-grid">
              <Field label={t('wageTypeLabel')}>
                <Select value={paymentType} onChange={(e) => setPaymentType(e.target.value as 'daily' | 'fixed')}>
                  <option value="daily">{t('daily')}</option>
                  <option value="fixed">{t('fixed')}</option>
                </Select>
              </Field>

              <Field label={t('wageAmountLabel')}>
                <Input
                  type="number"
                  min="100"
                  max="50000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  required
                />
              </Field>

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

              <Field label={t('workDateLabel')}>
                <Input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} required />
              </Field>

              <Field label={t('startTimeLabel')}>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              </Field>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <Button variant="secondary" type="button" onClick={() => setStep(1)}>
                ← {t('back')}
              </Button>
              <Button type="button" onClick={() => setStep(3)}>
                {t('next')} →
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <div className="profile-form-grid">
              <Field label={t('village')}>
                <Input value={village} onChange={(e) => setVillage(e.target.value)} required />
              </Field>

              <Field label={t('taluka')}>
                <Input value={taluka} onChange={(e) => setTaluka(e.target.value)} required />
              </Field>

              <Field label={t('district')}>
                <Input value={district} onChange={(e) => setDistrict(e.target.value)} required />
              </Field>
            </div>

            <Field label={t('requiredSkillsLabel')}>
              <div className="selectable-grid" style={{ marginTop: 8 }}>
                {skillOptions.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    className={`selection-card ${requiredSkillIds.includes(skill.id) ? 'is-selected' : ''}`}
                    onClick={() => toggleSkill(skill.id)}
                  >
                    <span>{skill.name[language]}</span>
                    <small>{requiredSkillIds.includes(skill.id) ? '✓' : '+'}</small>
                  </button>
                ))}
              </div>
            </Field>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <Button variant="secondary" type="button" onClick={() => setStep(2)}>
                ← {t('back')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('loading') : t('postWorkSubmit')}
              </Button>
            </div>
          </Card>
        )}
      </form>
    </section>
  )
}
