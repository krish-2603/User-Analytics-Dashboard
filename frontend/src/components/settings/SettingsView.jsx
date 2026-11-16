import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Trash2,
  Sparkles,
  Server,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  Layers,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export default function SettingsView({ onDataMutated }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await api.getSystemStats();
      if (data) setStats(data);
    } catch (err) {
      console.error('Error fetching system stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await api.seedDatabase(180);
      setNotification({
        type: 'success',
        message: res.message || 'Successfully seeded 180 realistic records across 30 days!'
      });
      fetchStats();
      if (onDataMutated) onDataMutated();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to seed sample data.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await api.resetDatabase();
      setNotification({
        type: 'success',
        message: res.message || 'Database reset successfully.'
      });
      setConfirmReset(false);
      fetchStats();
      if (onDataMutated) onDataMutated();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to reset database.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Settings Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          System Maintenance & Diagnostics
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Admin Dashboard Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage sample datasets, inspect database storage, and monitor backend service health.
        </p>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Database Diagnostic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-medium">Total DB Records</p>
            <p className="text-xl font-bold text-white font-mono">{stats?.totalRequests ?? 0}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-medium">SQLite File Size</p>
            <p className="text-xl font-bold text-white font-mono">{stats?.dbSizeFormatted ?? '0.00 MB'}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-medium">Server Uptime</p>
            <p className="text-xl font-bold text-white font-mono">{stats?.serverUptime ?? '0s'}</p>
          </div>
        </div>
      </div>

      {/* Dataset Actions */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Layers className="w-4 h-4 text-blue-400" />
          Data Seeding & Generation
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Seed Realistic 30-Day Historical Traffic
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Populates SQLite with 180 realistic simulated web visits across multiple countries, browsers, and routes.
            </p>
          </div>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Seed 180 Records</span>
          </button>
        </div>

        {/* Danger Zone: Database Reset */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4" />
            Danger Zone
          </h3>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-rose-300">Reset All Analytics Data</h4>
              <p className="text-xs text-rose-400/80 mt-0.5">
                Clears all logged web requests and vacuums the SQLite database file.
              </p>
            </div>

            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                >
                  Confirm Delete All
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all shrink-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Database</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
