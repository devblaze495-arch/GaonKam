import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Phone, Wrench, Plus, Star } from 'lucide-react'
import { Card } from '../components/ui/Foundation'
import { EmptyState, LoadingState } from '../components/states/AsyncStates'
import { useLanguage } from '../i18n/useLanguage'
import { servicesService } from '../services/servicesService'
import { localizedText, type Service } from '../types'

export function ServicesPage() {
  const { language, t, formatReviewCount } = useLanguage()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCat, setSelectedCat] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const serviceCategories = [
    { id: 'all', label: language === 'mr' ? 'सर्व' : language === 'hi' ? 'सभी' : 'All' },
    { id: 'electrician', label: language === 'mr' ? 'इलेक्ट्रिशियन' : language === 'hi' ? 'इलेक्ट्रीशियन' : 'Electrician' },
    { id: 'plumber', label: language === 'mr' ? 'प्लंबर' : language === 'hi' ? 'प्लंबर' : 'Plumber' },
    { id: 'tractor', label: language === 'mr' ? 'ट्रॅक्टर भाडे' : language === 'hi' ? 'ट्रैक्टर किराया' : 'Tractor Rental' },
    { id: 'mechanic', label: language === 'mr' ? 'मेकॅनिक' : language === 'hi' ? 'मैकेनिक' : 'Mechanic' },
    { id: 'carpenter', label: language === 'mr' ? 'सुतारकाम' : language === 'hi' ? 'बढ़ई' : 'Carpenter' },
  ]

  useEffect(() => {
    servicesService
      .listNearby()
      .then(setServices)
      .finally(() => setIsLoading(false))
  }, [])

  const filteredServices = services.filter((s) => {
    const name = localizedText(s.name, language).toLowerCase()
    const desc = localizedText(s.description, language).toLowerCase()
    const q = searchQuery.toLowerCase()
    return name.includes(q) || desc.includes(q)
  })

  if (isLoading) return <LoadingState label={t('loading')} />

  const emptyTitle = language === 'mr' ? 'सध्या जवळपास स्थानिक सेवा उपलब्ध नाहीत.' : language === 'hi' ? 'आस-पास कोई स्थानीय सेवा नहीं मिली।' : 'No local services found nearby.'
  const emptyDesc = language === 'mr' ? 'पहिली स्थानिक सेवा नोंदवा किंवा इतर श्रेणी तपासा!' : language === 'hi' ? 'पहली स्थानीय सेवा जोड़ें या अन्य श्रेणियों को देखें!' : 'Be the first to offer a local service or explore other categories!'

  return (
    <div className="find-work-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div>
          <h1 className="find-work-title">{t('servicesTitle')}</h1>
          <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {t('findServicesTitle')}
          </p>
        </div>
        <Link to="/my-services" style={{ textDecoration: 'none' }}>
          <button type="button" className="icon-btn" title={t('offerServiceTitle')} aria-label={t('offerServiceTitle')}>
            <Plus size={18} />
          </button>
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="search-with-filter-row" style={{ marginTop: 14 }}>
        <div className="find-work-search-box">
          <Search size={17} className="search-icon-svg" />
          <input
            type="text"
            placeholder={t('searchServicesPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="find-work-search-input"
          />
        </div>
        <button type="button" className="filter-toggle-button" aria-label={t('filterJobs')}>
          <SlidersHorizontal size={17} />
        </button>
      </div>

      {/* Category Pills */}
      <div className="category-scroll-bar">
        {serviceCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`category-pill ${selectedCat === cat.id ? 'is-active' : ''}`}
            onClick={() => setSelectedCat(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Service Listings */}
      {filteredServices.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDesc}
        />
      ) : (
        <div className="jobs-list">
          {filteredServices.map((service) => (
            <Card key={service.id} className="service-reference-card">
              <div className="service-card-left">
                <div className="service-avatar-photo">
                  <Wrench size={22} color="var(--accent-olive)" />
                </div>
                <div className="service-card-text">
                  <h3 className="service-name-heading">{localizedText(service.name, language)}</h3>
                  <div className="service-provider-sub">
                    {localizedText(service.provider, language) || 'Ramesh Patil'}
                  </div>
                  <div className="service-rating-line">
                    <Star size={13} fill="#D97706" color="#D97706" />
                    <strong>{service.rating ? service.rating.toFixed(1) : '4.8'}</strong>
                    <span className="review-count-bracket">{formatReviewCount(32)}</span>
                  </div>
                  <div className="service-loc-dist">
                    📍 {localizedText(service.location, language)}
                  </div>
                </div>
              </div>

              {/* Call CTA button */}
              <div className="service-card-call-action">
                <a
                  href={`tel:${(service as any).phone || '9876543210'}`}
                  className="service-call-circle-btn"
                  title={t('callProviderTitle')}
                  aria-label={t('callProviderTitle')}
                >
                  <Phone size={17} color="var(--primary)" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
