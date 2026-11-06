import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>
        <span className="nav-icon">🎯</span>
        Deals
      </NavLink>
      <span className="nav-disabled" title="Coming soon">
        <span className="nav-icon">🗺️</span>
        Map
      </span>
      <span className="nav-disabled" title="Coming soon">
        <span className="nav-icon">🔖</span>
        Saved
      </span>
    </nav>
  );
}
