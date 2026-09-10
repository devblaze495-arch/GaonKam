import { useState } from 'react'
import { Alert, Button, Card, Field, Input, PageHeader, Select } from '../components/ui/Foundation'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import { servicesService } from '../services/servicesService'

export function MyServicesPage() {
  const { user } = useAuth()
  const { language, t, localizeWageType } = useLanguage()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rateAmount, setRateAmount] = useState(500)
  const [rateType, setRateType] = useState<'daily' | 'hourly' | 'fixed'>('daily')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await servicesService.createService({
        name,
        description,
        rateAmount,
        rateType,
        village: user?.profile?.village || '',
        taluka: user?.profile?.taluka || '',
        district: user?.profile?.district || '',
      })
      setSuccess(true)
      setName('')
      setDescription('')
    } catch {
      alert(t('error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const namePlaceholder = language === 'mr' ? 'उदा. इलेक्ट्रिशियन, ट्रॅक्टर भाडे' : language === 'hi' ? 'उदा. इलेक्ट्रीशियन, ट्रैक्टर किराया' : 'e.g. Electrician, Tractor Rental'

  return (
    <section className="page-section">
      <PageHeader title={t('myServices')} backUrl="/services" />

      {success && <Alert tone="success">{t('serviceListedSuccess')}</Alert>}

      <Card>
        <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem' }}>{t('addServiceTitle')}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <Field label={t('serviceNameLabel')}>
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder={namePlaceholder} />
          </Field>

          <Field label={t('serviceDescLabel')}>
            <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Field>

          <div className="profile-form-grid">
            <Field label={t('rateTypeLabel')}>
              <Select value={rateType} onChange={(e) => setRateType(e.target.value as any)}>
                <option value="daily">{localizeWageType('daily')}</option>
                <option value="hourly">{localizeWageType('hourly')}</option>
                <option value="fixed">{localizeWageType('fixed')}</option>
              </Select>
            </Field>

            <Field label={t('serviceRateLabel')}>
              <Input type="number" value={rateAmount} onChange={(e) => setRateAmount(Number(e.target.value))} required />
            </Field>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        </form>
      </Card>
    </section>
  )
}
