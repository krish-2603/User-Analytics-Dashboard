import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  MapPin,
  Shield,
  Zap,
  Server,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

export default function IpLookupTool({ onQuickSimulate }) {
  const [ipInput, setIpInput] = useState('8.8.8.8');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState([]);
  const [simulatedSuccess, setSimulatedSuccess] = useState(null);

  // Load sample IPs
  useEffect(() => {
    api.getSampleIps().then(data => {
      if (data) setSamples(data);
    }).catch(err => console.error('Error loading sample IPs:', err));

    // Initial lookup of 8.8.8.8
    handleLookup('8.8.8.8');
  }, []);

  const handleLookup = async (targetIp) => {
    const ipToQuery = (targetIp || ipInput || '').trim();
    if (!ipToQuery) return;

    setLoading(true);
    setSimulatedSuccess(null);
    try {
      const data = await api.lookupIp(ipToQuery);
      setResult(data);
    } catch (err) {
      console.error('Error performing IP lookup:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateFromThisIp = async () => {
    if (!result || !result.ip) return;
    try {
      await api.simulateTraffic({
        count: 1,
        country: result.countryCode !== 'XX' ? result.countryCode : null
      });
      setSimulatedSuccess(`Web visit from ${result.ip} (${result.countryName}) successfully simulated!`);
      setTimeout(() => setSimulatedSuccess(null), 4000);
    } catch (err) {
      console.error('Error simulating visit:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-3">
            <Globe className="w-3.5 h-3.5" />
            Module 1.2: IP-to-Country Mapping
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Interactive GeoIP & Country Lookup
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Resolve IPv4 addresses to geographical countries, flags, cities, and autonomous systems.
            Works completely offline with fallback routing or dynamic resolution.
          </p>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup(ipInput);
          }}
          className="mt-6 flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="Enter an IPv4 address (e.g. 151.101.65.140, 8.8.8.8, 127.0.0.1)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {loading ? 'Resolving...' : 'Lookup IP'}
          </button>
        </form>
      </div>

      {/* Simulation Feedback Alert */}
      {simulatedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{simulatedSuccess}</span>
        </div>
      )}

      {/* Lookup Result Section */}
      {result && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-4xl select-none filter drop-shadow">
                {result.flag || '🌐'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {result.countryName}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {result.countryCode}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  IP Address: <strong className="text-blue-400">{result.ip}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleSimulateFromThisIp}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-emerald-400" />
              <span>Simulate Visit from this Country</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                City Location
              </span>
              <p className="text-sm font-semibold text-white">{result.city || 'Unknown City'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{result.continent || 'Global Region'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                Geographic Coordinates
              </span>
              <p className="text-sm font-mono font-semibold text-white">
                {result.latitude ? `${result.latitude.toFixed(2)}°, ${result.longitude.toFixed(2)}°` : '0.00°, 0.00°'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Approx Latitude / Longitude</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Autonomous System (ASN)
              </span>
              <p className="text-xs font-mono font-medium text-slate-200 truncate" title={result.asn}>
                {result.asn || 'General Public Routing'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Network Operator / ISP</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Resolution Source
              </span>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {result.lookupSource || 'Local Database'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {result.isPrivate ? 'Internal Network' : 'Public IPv4 Subnet'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sample IPs Quick-Pick Catalog */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">Pre-Configured Test IPs Across the Globe</h3>
          <p className="text-xs text-slate-400">
            Click any sample IP to instantly test resolution and inspect its country mapping:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {samples.map((s) => (
            <button
              key={s.ip}
              onClick={() => {
                setIpInput(s.ip);
                handleLookup(s.ip);
              }}
              className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 text-left transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg select-none">{s.flag}</span>
                  <span className="font-mono text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                    {s.ip}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate mt-1">{s.label}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
