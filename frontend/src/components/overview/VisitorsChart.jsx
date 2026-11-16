import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

export default function VisitorsChart({ data, dateFilter }) {
  const chartData = (data && data.length > 0) ? data : [
    { time_bucket: 'Day 1', visitors: 12, page_views: 18 },
    { time_bucket: 'Day 2', visitors: 24, page_views: 35 },
    { time_bucket: 'Day 3', visitors: 19, page_views: 28 },
    { time_bucket: 'Day 4', visitors: 35, page_views: 52 },
    { time_bucket: 'Day 5', visitors: 42, page_views: 64 },
    { time_bucket: 'Day 6', visitors: 38, page_views: 59 },
    { time_bucket: 'Day 7', visitors: 48, page_views: 76 }
  ];

  const formatXAxis = (tickItem) => {
    if (!tickItem) return '';
    if (tickItem.includes(':')) {
      // Hour format (e.g., "2026-11-16 14:00")
      return tickItem.split(' ')[1] || tickItem;
    }
    // Date format (e.g., "2026-11-16")
    const parts = tickItem.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}`;
    }
    return tickItem;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            {label}
          </p>
          <div className="space-y-1">
            <p className="text-blue-400 font-medium">
              Visitors: <span className="font-bold text-white">{payload[0]?.value}</span>
            </p>
            {payload[1] && (
              <p className="text-indigo-400 font-medium">
                Page Views: <span className="font-bold text-white">{payload[1]?.value}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Visitors & Page Views Over Time
          </h3>
          <p className="text-xs text-slate-400">
            Traffic volume grouped by time period ({dateFilter})
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-400">Visitors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-400">Page Views</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pageViewGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="time_bucket"
              tickFormatter={formatXAxis}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#visitorGradient)"
            />
            <Area
              type="monotone"
              dataKey="page_views"
              stroke="#6366f1"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#pageViewGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
