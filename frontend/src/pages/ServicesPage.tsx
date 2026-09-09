import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, PageHeader, Rating } from '../components/ui/Foundation'
import { EmptyState, LoadingState } from '../components/states/AsyncStates'
import { useLanguage } from '../i18n/useLanguage'
import { servicesService } from '../services/servicesService'
import { localizedText, type Service } from '../types'

export function ServicesPage() {
  const { language, t } = useLanguage()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    servicesService
      .listNearby()
      .then(setServices)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <LoadingState label={t('loading')} />

  return (
    <section className="page-section">
      <PageHeader
        title={t('navServices')}
        action={
          <Link to="/my-services">
            <Button>+ {t('offerService')}</Button>
          </Link>
        }
      />

      {services.length === 0 ? (
        <EmptyState title="No services found" description="Be the first to offer a local service in your village!" />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {services.map((service) => (
            <Card key={service.id} className="service-card">
              <div className="service-avatar" aria-hidden="true">
                {localizedText(service.name, language).slice(0, 1)}
              </div>
              <div className="service-card__body">
                <div className="service-card__heading">
                  <h3>{localizedText(service.name, language)}</h3>
                  <Rating value={service.rating} />
                </div>
                <p>{localizedText(service.description, language)}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <strong>{localizedText(service.rate, language)}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>📍 {localizedText(service.location, language)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
