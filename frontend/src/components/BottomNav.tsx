import { NavLink } from 'react-router-dom';
import { Icon } from './Icon';

const ITEMS = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/servicios', label: 'Buscar', icon: 'search' },
  { to: '/mapa', label: 'Mapa', icon: 'map-pin' },
  { to: '/perfil', label: 'Perfil', icon: 'user' },
] as const;

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon name={item.icon} strokeWidth={1.8} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
