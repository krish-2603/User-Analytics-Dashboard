import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  Sliders,
  CheckCircle,
  Eye,
  Activity,
  Globe,
  Radio,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import RequestDetailModal from '../analytics/RequestDetailModal';

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function TrafficSimulatorPanel({ onTrafficGenerated }) {
  const [batchCount, setBatchCount] = useState(5);
  const [targetCountry, setTargetCountry] = useState('');
  const [targetPage, setTargetPage] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Auto-simulation mode
  const [autoSimulate, setAutoSimulate] = useState(false);
  const [autoIntervalSec, setAutoIntervalSec] = useState(3);

  // Stream of recent simulation results
  const [stream, setStream] = useState([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Available options
  const [options, setOptions] = useState({ pages: [], browsers: [], operatingSystems: [] });
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    // Load simulation options & countries
    api.getSimulatorOptions().then(data => {
      if (data) setOptions(data);
    }).catch(err => console.error(err));

    api.getFilters().then(data => {
      if (data && data.countries) setCountryOptions(data.countries);
    }).catch(err => console.error(err));

    // Initial load of latest requests
    api.getRecentRequests(10).then(data => {
      if (data) setStream(data);
    }).catch(err => console.error(err));
  }, []);

  // Handle single or batch simulation
  const handleSimulate = async (countOverride = null) => {
    const count = countOverride || batchCount;
    setIsSimulating(true);

    try {
      const res = await api.simulateTraffic({
        count,
        country: targetCountry || null,
        targetPage: targetPage || null
      });

      if (res && res.success && res.data) {
        // Prepend new records to stream
        setStream(prev => [...res.data, ...prev].slice(0, 50));
        setSessionCount(prev => prev + res.data.length);
        if (onTrafficGenerated) onTrafficGenerated();
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Auto-simulation loop
  useEffect(() => {
    let timer = null;
    if (autoSimulate) {
      timer = setInterval(() => {
        handleSimulate(1);
      }, autoIntervalSec * 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoSimulate, autoIntervalSec, targetCountry, targetPage]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Control Console Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Module 1.1: Web Request Simulator
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Traffic Simulation Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate realistic visits from diverse global IP addresses, browsers, platforms, and page routes.
            </p>
          </div>

          {/* Session Metrics Pill */}
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/80 shrink-0">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Simulated This Session</p>
              <p className="text-lg font-bold text-white font-mono">{sessionCount} requests</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          {/* Batch Size Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Batch Volume (Requests per Click)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 5, 10, 25, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setBatchCount(num)}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    batchCount === num
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          {/* Target Country Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Origin Country Pool
            </label>
            <select
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Global Random Distribution (Default)</option>
              {countryOptions.map(c => (
                <option key={c.country_code} value={c.country_code}>
                  {c.country_name} ({c.country_code})
                </option>
              ))}
            </select>
          </div>

          {/* Target Page Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Target Page Route
            </label>
            <select
              value={targetPage}
              onChange={(e) => setTargetPage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Realistic Page Spread (Default)</option>
              {options.pages.map(p => (
                <option key={p.path} value={p.path}>
                  {p.path} - {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          {/* Main "Simulate Traffic" Button as required in 1.1 */}
          <button
            onClick={() => handleSimulate()}
            disabled={isSimulating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Generating {batchCount} Requests...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Simulate Traffic (+{batchCount})</span>
              </>
            )}
          </button>

          {/* Auto-Simulation Stream Toggle */}
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80">
            <div className="flex items-center gap-2">
              <Radio className={`w-4 h-4 ${autoSimulate ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs font-medium text-slate-300">Continuous Traffic:</span>
            </div>

            <button
              onClick={() => setAutoSimulate(prev => !prev)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                autoSimulate
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {autoSimulate ? 'Active (Auto ON)' : 'Start Auto'}
            </button>

            {autoSimulate && (
              <select
                value={autoIntervalSec}
                onChange={(e) => setAutoIntervalSec(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-300"
              >
                <option value="1">1 req / 1s</option>
                <option value="3">1 req / 3s</option>
                <option value="5">1 req / 5s</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Live Stream Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse-dot" />
            <h3 className="text-sm font-bold text-white">Live Stream of Simulated Requests</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing latest {stream.length} incoming events
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-3.5">IP Address</th>
                <th className="py-3 px-3.5">Country & Flag</th>
                <th className="py-3 px-3.5">Page Visited</th>
                <th className="py-3 px-3.5">Client OS & Browser</th>
                <th className="py-3 px-3.5">HTTP Status</th>
                <th className="py-3 px-3.5 text-right">Timestamp</th>
                <th className="py-3 px-3.5 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {stream.map((req, idx) => (
                <tr
                  key={req.id || req.request_id || idx}
                  onClick={() => setSelectedRequest(req)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3.5 font-mono font-medium text-blue-400 group-hover:text-blue-300">
                    {req.ip_address}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
                      <span className="text-base select-none">{getFlagEmoji(req.country_code)}</span>
                      <span>{req.country_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({req.country_code})</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {req.page_visited}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="text-slate-200 block">{req.browser}</span>
                    <span className="text-slate-400 text-[11px] block">{req.os}</span>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        req.status_code === 200
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {req.status_code || 200}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-slate-400 text-[11px]">
                    {req.timestamp ? new Date(req.timestamp).toLocaleTimeString() : ''}
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(req);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {stream.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No simulated requests yet. Click the "Simulate Traffic" button above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
