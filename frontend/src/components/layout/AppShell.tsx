import { NavLink, Outlet } from 'react-router-dom'
import { Bell, Briefcase, Home, MapPin, PlusCircle, User as UserIcon, Wrench, LogOut, Sprout } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { useLanguage } from '../../i18n/useLanguage'

export function AppShell() {
  const { user, logout } = useAuth()
  const { language, languageLabels, setLanguage, t } = useLanguage()

  const locationLabel = user?.profile?.village ? `${user.profile.village}, ${user.profile.district}` : ''

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="app-brand">
            <div className="app-brand-logo">
              <Sprout size={20} />
            </div>
            <div className="app-brand-text">
              <span className="app-brand-title">{t('appTitle')}</span>
              <span className="app-brand-sub">गावकाम</span>
            </div>
          </NavLink>

          <div className="app-header__actions">
            {locationLabel && (
              <span className="location-chip">
                <MapPin size={13} color="var(--primary)" /> {locationLabel}
              </span>
            )}
            <select
              className="language-selector"
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              aria-label={t('changeLanguage')}
            >
              {Object.entries(languageLabels).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <button className="icon-btn" title={t('notifications')} aria-label={t('notifications')}>
              <Bell size={17} />
            </button>
            {user && (
              <button onClick={logout} className="icon-btn" title={t('logout')} aria-label={t('logout')}>
                <LogOut size={17} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-content">
        <div className="app-content__inner">
          <Outlet />
        </div>
      </main>

      <nav className="bottom-nav" aria-label={t('mainNavigation')}>
        <NavLink to="/" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <Home size={20} />
          <span>{t('navHome')}</span>
        </NavLink>
        <NavLink to="/jobs" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <Briefcase size={20} />
          <span>{t('navJobs')}</span>
        </NavLink>
        <NavLink to="/post-job" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <PlusCircle size={20} />
          <span>{t('navPostWork')}</span>
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <Wrench size={20} />
          <span>{t('navServices')}</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <UserIcon size={20} />
          <span>{t('navProfile')}</span>
        </NavLink>
      </nav>
    </div>
  )
}
