import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Clock, BarChart2, Settings, LogOut, BookOpen, Trophy, Info } from 'lucide-react';
import { useEffect } from 'react';
import { Onboarding } from './Onboarding';

export function Layout() {
  const { user, logout, settings } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  if (!user) return null;

  const navItems = [
    { to: '/app/learn', icon: BookOpen, label: 'Learn' },
    { to: '/app/achievements', icon: Trophy, label: 'Achievements' },
    { to: '/app/analytics', icon: BarChart2, label: 'Analytics' },
    { to: '/app/settings', icon: Settings, label: 'Settings' },
    { to: '/app/about', icon: Info, label: 'About' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-indigo-500/20 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">FocusForge</h1>
            <p className="text-xs text-slate-400">Welcome, {user.name}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        <div className="p-8 max-w-5xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>

      <Onboarding />
    </div>
  );
}
