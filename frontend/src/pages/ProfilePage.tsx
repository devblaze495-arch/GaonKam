import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Briefcase, FileText, Wrench, Settings, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react'
import { Card, TrustScore } from '../components/ui/Foundation'
import { ErrorState, LoadingState } from '../components/states/AsyncStates'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import { profileService } from '../services/profileService'
import { localizedName } from '../types/auth'
import type { ProfileData } from '../types/profile'

export function ProfilePage() {
  const { user, deleteAccount } = useAuth()
  const { language, t, localizeRole } = useLanguage()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [hasError, setHasError] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user) {
      profileService.getProfile(user).then(setProfile).catch(() => setHasError(true))
    }
  }, [user])

  async function handleDeleteAccount() {
    if (!window.confirm(t('deleteAccountConfirm'))) return
    setIsDeleting(true)
    try {
      await deleteAccount()
      navigate('/login', { replace: true })
    } catch {
      alert(t('error'))
      setIsDeleting(false)
    }
  }

  if (!profile) {
    return hasError ? (
      <section className="page-section">
        <ErrorState title={t('profileLoadError')} retryLabel={t('retry')} onRetry={() => window.location.reload()} />
      </section>
    ) : (
      <LoadingState label={t('loading')} />
    )
  }

  const displayName = localizedName(profile.fullName, language) || 'Sagar Deshmukh'
  const displayPhone = user?.phone ? `+91 ${user.phone}` : '+91 98765 43210'
  const locationText = profile.village ? `${profile.village}, ${profile.district}` : ''
  const settingsLabel = language === 'mr' ? 'सेटिंग्ज' : language === 'hi' ? 'सेटिंग्स' : 'Settings'
  const settingsDesc = language === 'mr' ? 'भाषा, माहिती आणि इतर' : language === 'hi' ? 'भाषा, जानकारी और अन्य' : 'Language, notifications, etc.'

  return (
    <div className="profile-reference-view">
      {/* Top Header */}
      <div className="profile-top-header">
        <h1 className="find-work-title">{t('navProfile')}</h1>
        <Link to="/profile/edit" className="profile-edit-text-btn">
          {t('edit')}
        </Link>
      </div>

      {/* Profile Overview Card */}
      <Card className="profile-hero-card">
        <div className="profile-hero-avatar">
          <div className="avatar-circle-inner">
            <User size={38} color="#FFFFFF" />
          </div>
        </div>

        <div className="profile-hero-details">
          <h2 className="profile-name-title">{displayName}</h2>
          <div className="profile-contact-line">📞 {displayPhone}</div>
          {locationText && <div className="profile-location-line">📍 {locationText}</div>}

          <div className="profile-badges-row">
            <span className="profile-role-chip">{user?.intents?.includes('post-work') ? localizeRole('employer') : localizeRole('worker')}</span>
            <span className="profile-status-chip">
              <CheckCircle2 size={13} color="#2E7D32" />
              <span>{t('profileCompleteStatus')}</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Trust & Ratings Summary */}
      <div style={{ margin: '14px 0' }}>
        <TrustScore
          score={profile.trust.score || 85}
          completedJobs={profile.trust.completedJobs}
          completedJobsLabel={t('completedWork')}
          label={t('trustScore')}
        />
      </div>

      {/* Navigation Options List */}
      <div className="profile-navigation-group">
        <Link to="/my-jobs" className="profile-nav-card">
          <div className="profile-nav-icon" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
            <Briefcase size={20} />
          </div>
          <div className="profile-nav-text">
            <strong>{t('myPostedJobs')}</strong>
            <small>{t('viewPostedJobsSub')}</small>
          </div>
          <ChevronRight size={18} className="profile-nav-arrow" />
        </Link>

        <Link to="/my-applications" className="profile-nav-card">
          <div className="profile-nav-icon" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
            <FileText size={20} />
          </div>
          <div className="profile-nav-text">
            <strong>{t('myApplications')}</strong>
            <small>{t('trackApplicationsSub')}</small>
          </div>
          <ChevronRight size={18} className="profile-nav-arrow" />
        </Link>

        <Link to="/my-services" className="profile-nav-card">
          <div className="profile-nav-icon" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
            <Wrench size={20} />
          </div>
          <div className="profile-nav-text">
            <strong>{t('myServices')}</strong>
            <small>{t('manageServicesSub')}</small>
          </div>
          <ChevronRight size={18} className="profile-nav-arrow" />
        </Link>

        <Link to="/profile/edit" className="profile-nav-card">
          <div className="profile-nav-icon" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
            <Settings size={20} />
          </div>
          <div className="profile-nav-text">
            <strong>{settingsLabel}</strong>
            <small>{settingsDesc}</small>
          </div>
          <ChevronRight size={18} className="profile-nav-arrow" />
        </Link>
      </div>

      {/* Delete Account Option */}
      <div style={{ marginTop: 24, marginBottom: 12 }}>
        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: '#FFF5F5',
            border: '1px solid #FED7D7',
            color: '#C53030',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'background 0.2s',
          }}
        >
          <Trash2 size={16} />
          <span>{isDeleting ? t('deletingAccount') : t('deleteAccount')}</span>
        </button>
      </div>
    </div>
  )
}
