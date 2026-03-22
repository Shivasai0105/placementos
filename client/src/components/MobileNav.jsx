import { NavLink } from 'react-router-dom';

export default function MobileNav() {
  return (
    <div className="mobile-nav">
      <div className="mobile-nav-items">
        <NavLink to="/" end className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">📊</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/plan" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">📅</span>
          <span>Plan</span>
        </NavLink>
        <NavLink to="/problems" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">💻</span>
          <span>Problems</span>
        </NavLink>
        <NavLink to="/company" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">🏢</span>
          <span>Companies</span>
        </NavLink>
        <NavLink to="/applications" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">📋</span>
          <span>Tracker</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">📈</span>
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/comm-prep" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">🎤</span>
          <span>Comm</span>
        </NavLink>
        <NavLink to="/interview-prep" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">💡</span>
          <span>Interview</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <span className="mobile-nav-icon">⚙️</span>
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
}
