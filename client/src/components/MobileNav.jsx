import { NavLink } from 'react-router-dom';

/* Render a subset of critical routes for the bottom mobile bar to avoid clutter. 
   All routes are still available via the hamburger menu in MobileSidebar. */
export default function MobileNav() {
  return (
    <div className="mobile-nav">
      <div className="mobile-nav-items" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%', padding: '0 8px' }}>
        
        <NavLink to="/" end className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`} style={{ flexDirection: 'column', gap: '4px', fontSize: '0.6rem' }}>
          <span>DASH</span>
        </NavLink>
        
        <NavLink to="/plan" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`} style={{ flexDirection: 'column', gap: '4px', fontSize: '0.6rem' }}>
          <span>PLAN</span>
        </NavLink>

        <NavLink to="/applications" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`} style={{ flexDirection: 'column', gap: '4px', fontSize: '0.6rem' }}>
          <span>TRACK</span>
        </NavLink>

        <NavLink to="/problems" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`} style={{ flexDirection: 'column', gap: '4px', fontSize: '0.6rem' }}>
          <span>PROB</span>
        </NavLink>
        
        <NavLink to="/interview-prep" className={({ isActive }) => `tn-link${isActive ? ' active' : ''}`} style={{ flexDirection: 'column', gap: '4px', fontSize: '0.6rem' }}>
          <span>INTV</span>
        </NavLink>

      </div>
    </div>
  );
}
