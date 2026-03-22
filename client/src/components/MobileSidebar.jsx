import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/',              end: true,  icon: '>', label: 'DASHBOARD'   },
  { to: '/plan',          end: false, icon: '>', label: 'ROADMAP'     },
  { to: '/applications',  end: false, icon: '>', label: 'TRACKER'     },
  { to: '/problems',      end: false, icon: '>', label: 'PROBLEMS'    },
  { to: '/company',       end: false, icon: '>', label: 'COMPANIES'   },
  { to: '/comm-prep',     end: false, icon: '>', label: 'COMMUNICATION'},
  { to: '/interview-prep',end: false, icon: '>', label: 'INTERVIEW'   },
  { to: '/settings',      end: false, icon: '>', label: 'CONFIG'      },
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
      <div className={`sidebar-backdrop${open ? ' open' : ''}`} onClick={onClose} />
      <aside className={`mobile-sidebar${open ? ' open' : ''}`}>
        
        <div className="msb-header">
          <span className="msb-logo"><span style={{color: 'var(--green)'}}>&gt;_</span> PlacementOS</span>
          <button className="msb-close" onClick={onClose} aria-label="Close menu">✕</button>
        </div>

        {user && (
          <div className="msb-user">
            <div className="msb-user-icon tn-avatar" style={{width: 24, height: 24, fontSize: '0.7rem'}}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="msb-user-name">AUTH: {user.name?.toUpperCase()}</span>
          </div>
        )}

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

        <div className="msb-footer">
          <button className="msb-theme-btn" onClick={toggleTheme}>
            <span style={{color: 'var(--muted)'}}>[{theme === 'dark' ? '☀️' : '🌙'}]</span> TOGGLE_UI_MODE
          </button>
          <button className="msb-logout-btn" onClick={handleLogout}>
            TERMINATE_SESSION <span style={{marginLeft: 'auto'}}>[⎋]</span>
          </button>
        </div>
        
      </aside>
    </>
  );
}
