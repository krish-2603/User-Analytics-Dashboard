import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { Compass, Laptop, FileText } from 'lucide-react';

const BROWSER_COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];
const OS_COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f472b6'];

export default function DistributionCharts({ distribution }) {
  const browsers = distribution?.browsers || [];
  const operatingSystems = distribution?.os || [];
  const topPages = distribution?.topPages || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Browser Breakdown */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <Compass className="w-4 h-4 text-blue-400" />
          Browser Share
        </h3>
        <p className="text-xs text-slate-400 mb-3">Traffic by browser family</p>

        <div className="h-44 w-full relative flex items-center justify-center">
          {browsers.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={browsers}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {browsers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BROWSER_COLORS[index % BROWSER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded shadow text-xs">
                          <span className="font-semibold text-white">{payload[0].name}: </span>
                          <span className="text-blue-400 font-mono">{payload[0].value} visits</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <span className="text-xs text-slate-400">No browser data</span>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-xs">
          {browsers.slice(0, 4).map((b, i) => (
            <div key={b.name} className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: BROWSER_COLORS[i % BROWSER_COLORS.length] }}
              />
              <span className="text-slate-300 truncate">{b.name}</span>
              <span className="text-slate-400 font-mono ml-auto">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Operating System Breakdown */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <Laptop className="w-4 h-4 text-indigo-400" />
          Operating Systems
        </h3>
        <p className="text-xs text-slate-400 mb-3">Device platform distribution</p>

        <div className="h-44 w-full">
          {operatingSystems.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={operatingSystems} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded shadow text-xs">
                          <span className="font-semibold text-white">{payload[0].payload.name}: </span>
                          <span className="text-indigo-400 font-mono">{payload[0].value} visits</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {operatingSystems.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={OS_COLORS[index % OS_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No OS data
            </div>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-slate-400 text-center">
          Top platform: <span className="text-slate-200 font-semibold">{operatingSystems[0]?.name || 'N/A'}</span>
        </div>
      </div>

      {/* 3. Top Pages Visited */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-amber-400" />
          Top Visited Pages
        </h3>
        <p className="text-xs text-slate-400 mb-3">Most requested website routes</p>

        <div className="space-y-2.5 overflow-y-auto max-h-52 pr-1 flex-1">
          {topPages.slice(0, 5).map((page, idx) => (
            <div key={page.path || idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition-colors">
              <div className="min-w-0 pr-2">
                <p className="font-mono text-blue-400 truncate font-medium">{page.path}</p>
                <p className="text-[11px] text-slate-400 truncate">{page.title}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-white font-mono">{page.hits}</span>
                <p className="text-[10px] text-slate-400">views</p>
              </div>
            </div>
          ))}

          {topPages.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No page requests recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
