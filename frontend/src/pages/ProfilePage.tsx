import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../components/states/AsyncStates'
import { Card, Rating, StatusBadge, TrustScore } from '../components/ui/Foundation'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import { profileService } from '../services/profileService'
import { skillOptions } from '../data/profileData'
import { localizedName } from '../types/auth'
import type { TranslationKey } from '../i18n/translations'
import type { ProfileData } from '../types/profile'

export function ProfilePage() {
  const { user } = useAuth()
  const { language, t } = useLanguage()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [hasError, setHasError] = useState(false)
  useEffect(() => { if (user) profileService.getProfile(user).then(setProfile).catch(() => setHasError(true)) }, [user])
  if (!profile) return hasError ? <section className="page-section"><ErrorState title={t('profileLoadError')} retryLabel={t('retry')} onRetry={() => window.location.reload()} /></section> : <LoadingState label={t('loading')} />
  const displayName = localizedName(profile.fullName, language)
  const completion = [displayName, profile.village, profile.skills.length, profile.workPreferences.dailyWage, profile.workPreferences.availability, profile.transportation.vehicles.length].filter(Boolean).length
  const maskedPhone = user ? `+91 ••••••${user.phone.slice(-4)}` : ''
  return <section className="page-section profile-page"><div className="section-heading"><div><span className="eyebrow">{t('appTitle')}</span><h1>{t('profileTitle')}</h1></div><Link className="button button--secondary" to="/profile/edit">{t('editProfile')}</Link></div><Card className="profile-header-card"><div className="profile-avatar">{displayName.slice(0, 1)}</div><div className="profile-header-card__body"><h2>{displayName}</h2><p>{profile.village}, {profile.district}</p><StatusBadge label={t('open')} tone="success" /></div><div className="profile-completion"><strong>{Math.round((completion / 6) * 100)}%</strong><span>{t('profileCompletion')}</span></div></Card><div className="profile-grid"><Card><SectionTitle title={t('basicInformation')} /><InfoRow label={t('phone')} value={maskedPhone} /><InfoRow label={t('village')} value={`${profile.village}, ${profile.taluka}`} /><InfoRow label={t('district')} value={profile.district} /><InfoRow label={t('appLanguage')} value={languageLabel(profile.preferredLanguage, t)} /><InfoRow label={t('languagesKnown')} value={profile.languagesKnown.map((item) => languageKnownLabel(item, t)).join(', ')} /></Card><Card><SectionTitle title={t('skills')} /><div className="profile-skill-list">{profile.skills.length ? profile.skills.map((item) => { const skill = skillOptions.find((option) => option.id === item.skillId); return <div className="profile-skill-row" key={item.skillId}><span>{skill ? skill.name[language] : item.skillId}</span><small>{experienceLabel(item.experience, t)}</small></div> }) : <EmptyState title={t('noSkills')} description={t('addSkill')} />}</div><Link className="text-button profile-link" to="/profile/skills">{t('addSkill')} +</Link></Card><Card><SectionTitle title={t('workPreferences')} /><div className="preference-highlight"><strong>₹{profile.workPreferences.dailyWage.toLocaleString('en-IN')}</strong><span>{t('perDayLabel')}</span></div><InfoRow label={t('availability')} value={availabilityLabel(profile.workPreferences.availability, t)} /><InfoRow label={t('canTravel')} value={profile.transportation.canTravel ? t('yes') : t('no')} /></Card><Card><SectionTitle title={t('transportation')} /><div className="vehicle-tags">{profile.transportation.vehicles.length ? profile.transportation.vehicles.map((vehicle) => <span key={vehicle}>{vehicleLabel(vehicle, t)}</span>) : <EmptyState title={t('noVehicle')} description={t('transportation')} />}</div><InfoRow label={t('maxTravelDistance')} value={distanceLabel(profile.transportation.maxDistance, t)} /></Card><Card className="trust-card"><SectionTitle title={t('trustAndRatings')} /><TrustScore score={profile.trust.score} completedJobs={profile.trust.completedJobs} completedJobsLabel={t('completedWork')} label={t('trustScore')} /><div className="rating-summary"><Rating value={profile.rating.rating} accessibleLabel={`${profile.rating.rating} ${t('rating')}`} /><span>{profile.rating.reviewCount} {t('reviews')}</span></div><p className="form-hint">{t('trustExplanation')}</p></Card></div></section>
}

function SectionTitle({ title }: { title: string }) { return <div className="profile-section-title"><h2>{title}</h2></div> }
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="info-row"><span>{label}</span><strong>{value}</strong></div> }
function languageLabel(value: ProfileData['preferredLanguage'], t: (key: TranslationKey) => string) { return t(value === 'mr' ? 'marathiLanguage' : value === 'hi' ? 'hindiLanguage' : 'englishLanguage') }
function languageKnownLabel(value: string, t: (key: TranslationKey) => string) { return t(value === 'marathi' ? 'marathiLanguage' : value === 'hindi' ? 'hindiLanguage' : 'englishLanguage') }
function experienceLabel(value: string, t: (key: TranslationKey) => string) { const key: TranslationKey = value === 'less-than-year' ? 'lessThanYear' : value === 'one-three' ? 'oneThreeYears' : value === 'three-five' ? 'threeFiveYears' : 'fivePlusYears'; return t(key) }
function availabilityLabel(value: ProfileData['workPreferences']['availability'], t: (key: TranslationKey) => string) { return t(value === 'today' ? 'availableToday' : value === 'this-week' ? 'availableThisWeek' : value === 'selected-days' ? 'selectDays' : 'notAvailable') }
function vehicleLabel(value: string, t: (key: TranslationKey) => string) { const keys: Record<string, TranslationKey> = { none: 'noVehicle', bicycle: 'bicycle', motorcycle: 'motorcycle', scooter: 'scooter', auto: 'autoRickshaw', tractor: 'tractor', car: 'car', pickup: 'pickupTruck', other: 'otherVehicle' }; return t(keys[value] ?? 'otherVehicle') }
function distanceLabel(value: string, t: (key: TranslationKey) => string) { const keys: Record<string, TranslationKey> = { '5': 'fiveKm', '10': 'tenKm', '20': 'twentyKm', '30-plus': 'thirtyPlusKm' }; return t(keys[value] ?? 'tenKm') }
