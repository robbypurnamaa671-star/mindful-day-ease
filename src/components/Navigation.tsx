import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sun, Moon as MoonIcon, History, Settings, Wind } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

const navItems = [
  { path: '/', icon: Sun, label: 'Today' },
  { path: '/breathe', icon: Wind, label: 'Breathe' },
  { path: '/reflect', icon: MoonIcon, label: 'Reflect' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Navigation() {
  const location = useLocation();
  const { softTap } = useHaptics();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 px-6 py-2 pb-safe z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => softTap()}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'animate-scale-in')} />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
