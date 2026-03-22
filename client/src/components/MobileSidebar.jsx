import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/',              end: true,  icon: '📊', label: 'Dashboard'   },
  { to: '/plan',          end: false, icon: '📅', label: 'Plan'        },
  { to: '/problems',      end: false, icon: '💻', label: 'Problems'    },
  { to: '/company',       end: false, icon: '🏢', label: 'Companies'   },
  { to: '/applications',  end: false, icon: '📋', label: 'Tracker'     },
  { to: '/analytics',     end: false, icon: '📈', label: 'Analytics'   },
  { to: '/comm-prep',     end: false, icon: '🎤', label: 'Comm Prep'   },
  { to: '/interview-prep',end: false, icon: '💡', label: 'Interview'   },
  { to: '/settings',      end: false, icon: '⚙️', label: 'Settings'    },
];

export default function MobileSidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`sidebar-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`mobile-sidebar${open ? ' open' : ''}`}>
        {/* Header */}
        <div className="msb-header">
          <span className="msb-logo">PlacementOS</span>
          <button className="msb-close" onClick={onClose} aria-label="Close menu">✕</button>
        </div>

        {/* User info */}
        {user && (
          <div className="msb-user">
            <span className="msb-user-icon">👤</span>
            <span className="msb-user-name">{user.name?.toUpperCase()}</span>
          </div>
        )}

        {/* Nav links */}
        <nav className="msb-nav">
          {navItems.map(({ to, end, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `msb-link${isActive ? ' active' : ''}`}
            >
              <span className="msb-link-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="msb-footer">
          <button className="msb-theme-btn" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="msb-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
