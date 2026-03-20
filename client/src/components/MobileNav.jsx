import { NavLink } from 'react-router-dom';

export default function MobileNav() {
  return (
    <div className="mobile-nav">
      <div className="mobile-nav-items">
        <NavLink to="/" end className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/plan" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">📅</span>
          <span>Plan</span>
        </NavLink>
        <NavLink to="/problems" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">💻</span>
          <span>Problems</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">📈</span>
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">⚙️</span>
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
}
