import React, { useState, useEffect } from 'react';
import {
  Zap,
  RefreshCw,
  Clock,
  Sparkles,
  Radio
} from 'lucide-react';

export default function Topbar({
  currentView,
  dateFilter,
  setDateFilter,
  onQuickSimulate,
  onRefresh,
  isRefreshing,
  isSimulating
}) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const viewTitles = {
    overview: { title: 'Dashboard Overview', subtitle: 'Live Traffic Metrics & Geographic Insights' },
    analytics: { title: 'User Analytics', subtitle: 'Searchable Web Request Stream & Audit Log' },
    iplookup: { title: 'IP-to-Country Lookup', subtitle: 'Resolve Any IP Address with Country & Flag' },
    simulator: { title: 'Traffic Simulator', subtitle: 'Generate Realistic Web Requests from Diverse IPs' },
    css: { title: 'CSS Generator', subtitle: 'Customize Appearance, Columns, Aliases & Download Valid CSS' },
    settings: { title: 'System Settings', subtitle: 'Seed Sample Data & Database Management' }
  };

  const currentInfo = viewTitles[currentView] || { title: 'Admin Dashboard', subtitle: 'Analytics' };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {currentInfo.title}
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">{currentInfo.subtitle}</p>
        </div>
      </div>

      {/* Center Date Filter Pills (Shown on Overview & Analytics) */}
      {(currentView === 'overview' || currentView === 'analytics' || currentView === 'css') && (
        <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs">
          {[
            { id: 'today', label: 'Today' },
            { id: 'last7days', label: 'Last 7 Days' },
            { id: 'last30days', label: 'Last 30 Days' },
            { id: 'all', label: 'All Time' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                dateFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Traffic Pulse Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-400 font-medium">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Live Feed</span>
        </div>

        {/* Digital Clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{time}</span>
        </div>

        {/* Refresh Action Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Dashboard Data"
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
        </button>

        {/* Quick Simulate Traffic Action */}
        <button
          onClick={() => onQuickSimulate(5)}
          disabled={isSimulating}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSimulating ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Simulate Traffic (+5)</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
