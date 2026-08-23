import { Link, NavLink } from 'react-router-dom'

const nav = [
  { to: '/', label: '首页' },
  { to: '/fictions', label: '小说' },
  { to: '/articles', label: '文章' },
  { to: '/games', label: '游戏' },
  { to: '/tools', label: '工具' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="header-brand">Quanttide Founder</Link>
          <nav className="header-nav">
            {nav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link nav-active' : 'nav-link')}
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <span>&copy; 2026</span>
      </footer>
    </div>
  )
}
