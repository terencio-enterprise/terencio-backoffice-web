import { NavLink, Outlet } from 'react-router-dom';

export function MarketingLayout() {
  return (
    <div className="flex flex-col h-full w-full font-sans">
      {/* 100% Width Sleek Navigation Tabs */}
      <div className="flex space-x-6 border-b mb-6 px-2 sticky top-0 bg-[var(--background)] z-20" style={{ borderColor: 'var(--border)' }}>
        <TabLink to="" end label="Overview" />
        <TabLink to="campaigns" label="Campaigns" />
        <TabLink to="templates" label="Templates" />
      </div>

      {/* Nested Route Content */}
      <div className="flex-1 min-h-0 w-full max-w-[1600px] mx-auto pb-10">
        <Outlet />
      </div>
    </div>
  );
}

function TabLink({ to, end, label }: { to: string, end?: boolean, label: string }) {
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => 
        `pb-3 px-1 text-sm font-bold transition-all relative cursor-pointer outline-none tracking-wide`
      }
      style={({ isActive }) => ({ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' })}
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ backgroundColor: 'var(--accent)' }} />
          )}
        </>
      )}
    </NavLink>
  );
}
