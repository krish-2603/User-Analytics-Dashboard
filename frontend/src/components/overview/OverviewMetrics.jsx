import React from 'react';
import { Users, Globe, Eye, Zap, Activity } from 'lucide-react';
import StatCard from '../layout/StatCard';

export default function OverviewMetrics({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Visitors"
        value={Number(stats.total_visitors || 0).toLocaleString()}
        subtext="Simulated web visits"
        trend="+14.2%"
        icon={Users}
        color="blue"
      />

      <StatCard
        title="Unique IP Addresses"
        value={Number(stats.unique_ips || 0).toLocaleString()}
        subtext="Distinct client IPs"
        trend="+9.8%"
        icon={Zap}
        color="indigo"
      />

      <StatCard
        title="Countries Reached"
        value={stats.total_countries || 0}
        subtext="Global geographic spread"
        icon={Globe}
        color="emerald"
      />

      <StatCard
        title="Total Page Views"
        value={Number(stats.total_page_views || 0).toLocaleString()}
        subtext="Aggregate page hits"
        trend="+18.5%"
        icon={Eye}
        color="purple"
      />

      <StatCard
        title="Avg Response Time"
        value={`${stats.avg_response_time || 0} ms`}
        subtext={`Success rate: ${stats.success_rate || 100}%`}
        icon={Activity}
        color="amber"
      />
    </div>
  );
}
