import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

export default function Navbar({ onMenuOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="terminal-nav">
      {/* Hamburger — only visible on mobile */}
      <button className="tn-hamburger" onClick={onMenuOpen} aria-label="Open menu">
        ☰
      </button>

      {/* Logo */}
      <NavLink to="/" className="tn-logo">
        <span className="tn-icon">&gt;_</span>
        <span className="tn-brand">PlacementOS</span>
      </NavLink>

      {/* Links - Centered desktop */}
      <div className="tn-links">
        <NavLink to="/" end className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`}>
          DASHBOARD
        </NavLink>
        <NavLink to="/plan" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`}>
          PLAN
        </NavLink>
        <NavLink to="/applications" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`}>
          TRACKER
        </NavLink>
        <NavLink to="/company" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`}>
          COMPANIES
        </NavLink>
        <NavLink to="/problems" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`}>
          PROBLEMS
        </NavLink>
        <NavLink to="/comm-prep" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`}>
          COMMUNICATION
        </NavLink>
        <NavLink to="/interview-prep" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`}>
          INTERVIEW
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`}>
          CONFIG
        </NavLink>
      </div>

      {/* Right side actions */}
      <div className="tn-actions">
        <button 
          className="tn-theme-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        {user ? (
          <div className="tn-profile-wrap">
            <span className="tn-search-icon" style={{marginRight: '12px', opacity: 0.5, cursor: 'not-allowed'}}>🔍</span>
            <div className="tn-avatar" title={`Logged in as ${user.name}`} onClick={handleLogout}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <button className="btn btn-green" onClick={() => navigate('/login')}>LOGIN</button>
        )}
      </div>
    </nav>
  );
}
