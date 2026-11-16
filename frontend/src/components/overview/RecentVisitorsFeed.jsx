import React from 'react';
import { Radio, ExternalLink, Zap } from 'lucide-react';

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function RecentVisitorsFeed({
  visitors,
  onSelectRequest,
  onQuickSimulate,
  isSimulating
}) {
  const list = visitors || [];

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-dot" />
          <div>
            <h3 className="text-sm font-bold text-white">Live Incoming Web Requests</h3>
            <p className="text-xs text-slate-400">Real-time simulated requests with IP-to-country resolution</p>
          </div>
        </div>

        <button
          onClick={() => onQuickSimulate(5)}
          disabled={isSimulating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-blue-400" />
          <span>Simulate Traffic</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-700/80">
            <tr>
              <th className="py-2.5 px-3">IP Address</th>
              <th className="py-2.5 px-3">Country</th>
              <th className="py-2.5 px-3">Page Visited</th>
              <th className="py-2.5 px-3">Browser / OS</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {list.map((item) => (
              <tr
                key={item.id || item.request_id}
                onClick={() => onSelectRequest(item)}
                className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <td className="py-2.5 px-3 font-mono font-medium text-blue-400 group-hover:text-blue-300">
                  {item.ip_address}
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
                    <span className="text-sm select-none">{getFlagEmoji(item.country_code)}</span>
                    <span>{item.country_name}</span>
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                    {item.page_visited}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-400">
                  <span>{item.browser}</span>
                  <span className="text-slate-400 text-[11px] block">{item.os}</span>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      item.status_code === 200
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : item.status_code === 404
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {item.status_code || 200}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right text-slate-400 font-mono text-[11px]">
                  {formatRelativeTime(item.timestamp)}
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  No requests recorded yet. Click "Simulate Traffic" above to generate web visits!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
