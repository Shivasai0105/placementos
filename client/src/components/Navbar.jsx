import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">PlacementOS</NavLink>

      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/plan" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          📅 Plan
        </NavLink>
        <NavLink to="/problems" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          💻 Problems
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          📈 Analytics
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          ⚙️ Settings
        </NavLink>
      </div>

      <div className="nav-right">
        {user && <span className="nav-user">{user.name?.toUpperCase()}</span>}
        <button className="btn" onClick={handleLogout}>LOGOUT</button>
      </div>
    </nav>
  );
}
