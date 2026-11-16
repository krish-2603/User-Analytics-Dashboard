import React from 'react';
import {
  LayoutDashboard,
  Users,
  Globe,
  Zap,
  Code2,
  Settings,
  Activity,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, stats }) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'KPI metrics & charts'
    },
    {
      id: 'analytics',
      label: 'User Analytics',
      icon: Users,
      badge: stats?.total_visitors ? `${stats.total_visitors}` : null,
      description: 'Search & request logs'
    },
    {
      id: 'iplookup',
      label: 'IP Lookup',
      icon: Globe,
      description: 'GeoIP & country lookup'
    },
    {
      id: 'simulator',
      label: 'Traffic Simulator',
      icon: Zap,
      highlight: true,
      description: 'Simulate web requests'
    },
    {
      id: 'css',
      label: 'CSS Generator',
      icon: Code2,
      description: 'Styles & Data CSS Studio'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Seed & database tools'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 bg-slate-900/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
            Admin Dashboard
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
              PRO
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 truncate">Analytics & CSS Studio</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`}
              />

              <div className="flex-1 text-left truncate">
                <span className="block leading-tight">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}

              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40">
        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-dot" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">SQLite In-Memory WAL</p>
            <p className="text-[10px] text-emerald-400">Database Healthy</p>
          </div>
          <ShieldCheck className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}
