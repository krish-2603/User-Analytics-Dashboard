import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import OverviewMetrics from './components/overview/OverviewMetrics';
import VisitorsChart from './components/overview/VisitorsChart';
import CountryChart from './components/overview/CountryChart';
import DistributionCharts from './components/overview/DistributionCharts';
import RecentVisitorsFeed from './components/overview/RecentVisitorsFeed';
import AnalyticsTable from './components/analytics/AnalyticsTable';
import IpLookupTool from './components/iplookup/IpLookupTool';
import TrafficSimulatorPanel from './components/simulator/TrafficSimulatorPanel';
import CssGeneratorWizard from './components/css/CssGeneratorWizard';
import SettingsView from './components/settings/SettingsView';
import RequestDetailModal from './components/analytics/RequestDetailModal';
import { api } from './services/api';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('overview');
  const [dateFilter, setDateFilter] = useState('all');

  // Overview dashboard data
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Inspector modal
  const [inspectedRequest, setInspectedRequest] = useState(null);

  // Global toast / notification
  const [toast, setToast] = useState(null);

  // Fetch all dashboard data
  const loadDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [overviewRes, chartsRes] = await Promise.all([
        api.getOverview(dateFilter),
        api.getCharts(dateFilter === 'today' ? 'today' : dateFilter === 'last30days' ? 'last30days' : 'last7days')
      ]);

      if (overviewRes) setStats(overviewRes);
      if (chartsRes) setChartData(chartsRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Global quick simulate traffic action
  const handleQuickSimulate = async (count = 5) => {
    setIsSimulating(true);
    try {
      const res = await api.simulateTraffic({ count });
      if (res && res.success) {
        showToast(`Simulated ${res.count} new requests successfully!`);
        await loadDashboardData();
      }
    } catch (err) {
      console.error('Simulate error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        stats={stats}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          currentView={currentView}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          onQuickSimulate={handleQuickSimulate}
          onRefresh={loadDashboardData}
          isRefreshing={isRefreshing}
          isSimulating={isSimulating}
        />

        {/* Dynamic Global Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-8 z-50 p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toast}</span>
          </div>
        )}

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* VIEW 1: Overview */}
          {currentView === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
              {/* Module 1.3: Update Admin Dashboard KPI Cards */}
              <OverviewMetrics stats={stats} />

              {/* Module 1.3: Visual Charts (Visitors over time & Visitors by country) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <VisitorsChart
                    data={chartData?.timeSeries}
                    dateFilter={dateFilter}
                  />
                </div>
                <div>
                  <CountryChart
                    countries={chartData?.countryBreakdown}
                  />
                </div>
              </div>

              {/* Traffic distribution by Browser, OS, Page */}
              <DistributionCharts
                distribution={chartData?.distribution}
              />

              {/* Module 1.1: Live Incoming Web Requests Feed */}
              <RecentVisitorsFeed
                visitors={stats?.recentVisitors}
                onSelectRequest={setInspectedRequest}
                onQuickSimulate={handleQuickSimulate}
                isSimulating={isSimulating}
              />
            </div>
          )}

          {/* VIEW 2: User Analytics Deep-Dive */}
          {currentView === 'analytics' && (
            <div className="max-w-7xl mx-auto animate-in fade-in">
              <AnalyticsTable
                onQuickSimulate={handleQuickSimulate}
                isSimulating={isSimulating}
              />
            </div>
          )}

          {/* VIEW 3: IP Lookup Tool */}
          {currentView === 'iplookup' && (
            <div className="animate-in fade-in">
              <IpLookupTool
                onQuickSimulate={handleQuickSimulate}
              />
            </div>
          )}

          {/* VIEW 4: Traffic Simulator Panel */}
          {currentView === 'simulator' && (
            <div className="animate-in fade-in">
              <TrafficSimulatorPanel
                onTrafficGenerated={loadDashboardData}
              />
            </div>
          )}

          {/* VIEW 5: CSS Generator */}
          {currentView === 'css' && (
            <div className="animate-in fade-in">
              <CssGeneratorWizard
                dateFilter={dateFilter}
              />
            </div>
          )}

          {/* VIEW 6: Settings & Diagnostics */}
          {currentView === 'settings' && (
            <div className="animate-in fade-in">
              <SettingsView
                onDataMutated={loadDashboardData}
              />
            </div>
          )}
        </main>
      </div>

      {/* Global Inspector Modal */}
      {inspectedRequest && (
        <RequestDetailModal
          request={inspectedRequest}
          onClose={() => setInspectedRequest(null)}
        />
      )}
    </div>
  );
}
