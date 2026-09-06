import { NavLink, Outlet } from 'react-router-dom'
import { useLanguage } from '../../i18n/useLanguage'

const navItems = [
  { to: '/', key: 'home' as const, icon: '⌂' },
  { to: '/jobs', key: 'jobs' as const, icon: '◫' },
  { to: '/services', key: 'services' as const, icon: '✦' },
  { to: '/profile', key: 'profile' as const, icon: '○' },
]

export function AppShell() {
  const { language, setLanguage, languageLabels, t } = useLanguage()

  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">ग</span>
          <span><strong>{t('appTitle')}</strong><small>{t('appTagline')}</small></span>
        </div>
        <nav className="sidebar-nav" aria-label={t('mainNavigation')}>
          {navItems.map((item) => <NavItem key={item.to} to={item.to} icon={item.icon} label={t(item.key)} />)}
        </nav>
        <div className="sidebar-footer">
          <label className="language-select">
            <span>{t('language')}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)}>
              {Object.entries(languageLabels).map(([code, label]) => <option key={code} value={code}>{label}</option>)}
            </select>
          </label>
          <p>© 2026 {t('appTitle')}</p>
        </div>
      </aside>

      <main className="app-main">
        <header className="mobile-header">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">ग</span>
            <strong>{t('appTitle')}</strong>
          </div>
          <button className="icon-button" aria-label={t('notifications')} title={t('notificationsUnavailable')}><span aria-hidden="true">♢</span><i /></button>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>

      <nav className="mobile-nav" aria-label={t('mainNavigation')}>
        {navItems.map((item) => <NavItem key={item.to} to={item.to} icon={item.icon} label={t(item.key)} mobile />)}
      </nav>
    </div>
  )
}

function NavItem({ to, icon, label, mobile = false }: { to: string; key?: string; icon: string; label: string; mobile?: boolean }) {
  return <NavLink to={to} className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''} ${mobile ? 'nav-item--mobile' : ''}`} end={to === '/'}><span className="nav-item__icon" aria-hidden="true">{icon}</span><span>{label}</span></NavLink>
}
