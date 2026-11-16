import React from 'react';
import { Globe, MapPin } from 'lucide-react';

// Country code to flag emoji helper
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function CountryChart({ countries }) {
  const list = countries || [];
  const maxCount = list.length > 0 ? Math.max(...list.map(c => c.count)) : 1;

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            Visitors by Country
          </h3>
          <p className="text-xs text-slate-400">
            Geographic distribution & visitor concentrations
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {list.length} Countries
        </span>
      </div>

      {list.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No country data available for this range.
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 max-h-72">
          {list.map((c, index) => {
            const flag = getFlagEmoji(c.country_code);
            const relativeWidth = Math.max(6, Math.round((c.count / maxCount) * 100));

            return (
              <div key={c.country_code || index} className="group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base select-none">{flag}</span>
                    <span className="font-medium text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                      {c.country_name || 'Unknown'}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      ({c.country_code})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-semibold text-white">{c.count}</span>
                    <span className="text-slate-400 text-[11px]">({c.percentage || 0}%)</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${relativeWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
