// Frontend API Client: Connects to Node.js / Express Backend
import axios from 'axios';

// Use relative URL in development (proxied by Vite) or fallback to direct localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

export const api = {
  // Analytics
  getOverview: (dateFilter = 'all') =>
    client.get('/analytics/overview', { params: { dateFilter } }).then(res => res.data.data),

  getCharts: (dateFilter = 'last7days') =>
    client.get('/analytics/charts', { params: { dateFilter } }).then(res => res.data.data),

  getRequests: (params = {}) =>
    client.get('/analytics/requests', { params }).then(res => res.data),

  getFilters: () =>
    client.get('/analytics/filters').then(res => res.data.data),

  // Simulator
  simulateTraffic: (payload) =>
    client.post('/simulator/simulate', payload).then(res => res.data),

  getRecentRequests: (limit = 15) =>
    client.get('/simulator/recent', { params: { limit } }).then(res => res.data.data),

  getSimulatorOptions: () =>
    client.get('/simulator/options').then(res => res.data.data),

  // IP Lookup
  lookupIp: (ip) =>
    client.get(`/ip-lookup/${encodeURIComponent(ip)}`).then(res => res.data.data),

  getSampleIps: () =>
    client.get('/ip-lookup/samples').then(res => res.data.data),

  // CSS Generator & Export
  getCssColumns: () =>
    client.get('/css/columns').then(res => res.data.data),

  previewCss: (payload) =>
    client.post('/css/preview', payload).then(res => res.data.data),

  downloadCss: async (payload) => {
    const response = await client.post('/css/download', payload, {
      responseType: 'blob'
    });

    // Create a blob URL and trigger browser download
    const blob = new Blob([response.data], { type: 'text/css;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    let filename = payload.filename || 'user_analytics.css';
    if (!filename.endsWith('.css')) filename += '.css';
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  },

  // Settings
  resetDatabase: () =>
    client.post('/settings/reset').then(res => res.data),

  seedDatabase: (count = 180) =>
    client.post('/settings/seed', { count }).then(res => res.data),

  getSystemStats: () =>
    client.get('/settings/stats').then(res => res.data.data)
};
