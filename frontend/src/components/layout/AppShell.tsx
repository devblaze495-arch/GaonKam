import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { useLanguage } from '../../i18n/useLanguage'
import { localizedName } from '../../types/auth'

export function AppShell() {
  const { user, logout } = useAuth()
  const { language, languageLabels, setLanguage, t } = useLanguage()

  const displayName = user ? localizedName(user.profile?.fullName, language) : ''
  const locationLabel = user?.profile?.village ? `${user.profile.village}, ${user.profile.district}` : ''

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="app-brand">
            <span className="brand-badge">गाव</span>
            <strong>{t('appTitle')}</strong>
          </NavLink>

          <div className="app-header__actions">
            {locationLabel && <span className="location-chip">📍 {locationLabel}</span>}
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
            {user && (
              <button onClick={logout} className="logout-button" title="Logout">
                🚪
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

      <nav className="bottom-nav" aria-label="Main Navigation">
        <NavLink to="/" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>{t('navHome')}</span>
        </NavLink>
        <NavLink to="/jobs" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <span>{t('navJobs')}</span>
        </NavLink>
        <NavLink to="/post-job" className={({ isActive }) => `bottom-nav__item bottom-nav__item--highlight ${isActive ? 'is-active' : ''}`}>
          <div className="plus-icon-wrapper">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <span>{t('navPostWork')}</span>
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          <span>{t('navServices')}</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>{displayName ? displayName.split(' ')[0] : t('navProfile')}</span>
        </NavLink>
      </nav>
    </div>
  )
}
