import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/snacks', icon: '🍿', label: 'Snacks' },
  { to: '/routines', icon: '📋', label: 'Routines' },
  { to: '/skills', icon: '🌳', label: 'Skills' },
  { to: '/stats', icon: '📊', label: 'Stats' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur border-t border-zinc-800 z-50 safe-area-pb">
      <div className="flex max-w-lg mx-auto">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 pt-3 gap-0.5 transition-colors ${
                isActive ? 'text-violet-400' : 'text-zinc-500'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
