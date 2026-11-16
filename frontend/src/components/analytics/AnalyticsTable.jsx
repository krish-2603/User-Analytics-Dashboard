import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Zap,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../../services/api';
import RequestDetailModal from './RequestDetailModal';

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function AnalyticsTable({ onQuickSimulate, isSimulating }) {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedBrowser, setSelectedBrowser] = useState('');
  const [selectedOs, setSelectedOs] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    browsers: [],
    operatingSystems: [],
    pages: []
  });

  const [selectedRow, setSelectedRow] = useState(null);

  // Fetch filter options once
  useEffect(() => {
    api.getFilters().then(data => {
      if (data) setFilterOptions(data);
    }).catch(err => console.error('Error fetching filter options:', err));
  }, []);

  // Fetch requests when filters or pagination changes
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.getRequests({
        page: pagination.page,
        limit: pagination.limit,
        search,
        country: selectedCountry,
        browser: selectedBrowser,
        os: selectedOs,
        pageVisited: selectedPage,
        sortBy,
        sortOrder
      });

      if (res && res.success) {
        setRequests(res.rows || []);
        setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error('Error fetching requests table:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [pagination.page, pagination.limit, selectedCountry, selectedBrowser, selectedOs, selectedPage, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchRequests();
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCountry('');
    setSelectedBrowser('');
    setSelectedOs('');
    setSelectedPage('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(column);
      setSortOrder('DESC');
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search IP, country, browser, route, city..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </form>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchRequests}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-50"
              title="Refresh logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
            >
              Reset Filters
            </button>

            <button
              onClick={() => onQuickSimulate(5)}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>Simulate Traffic (+5)</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
          {/* Country Selector */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Countries</option>
              {filterOptions.countries.map(c => (
                <option key={c.country_code} value={c.country_code}>
                  {c.country_name} ({c.country_code})
                </option>
              ))}
            </select>
          </div>

          {/* Browser Selector */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Browser</label>
            <select
              value={selectedBrowser}
              onChange={(e) => {
                setSelectedBrowser(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Browsers</option>
              {filterOptions.browsers.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Operating System */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Operating System</label>
            <select
              value={selectedOs}
              onChange={(e) => {
                setSelectedOs(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Operating Systems</option>
              {filterOptions.operatingSystems.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Page Visited */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Page Visited</label>
            <select
              value={selectedPage}
              onChange={(e) => {
                setSelectedPage(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Pages</option>
              {filterOptions.pages.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/90 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th
                  onClick={() => handleSort('ip_address')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>IP Address</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('country_name')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Country</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('page_visited')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Page Visited</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('browser')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Browser / OS</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status_code')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('timestamp')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Timestamp (UTC)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedRow(row)}
                  className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-medium text-blue-400 group-hover:text-blue-300">
                    {row.ip_address}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-200 font-medium">
                      <span className="text-base select-none">{getFlagEmoji(row.country_code)}</span>
                      <span>{row.country_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({row.country_code})</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {row.page_visited}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-200 block">{row.browser}</span>
                    <span className="text-slate-400 text-[11px] block">{row.os}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        row.status_code === 200
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : row.status_code === 404
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {row.status_code || 200}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400 text-[11px]">
                    {row.timestamp ? new Date(row.timestamp).toLocaleString() : ''}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRow(row);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                      title="View request payload"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                        Loading request logs...
                      </span>
                    ) : (
                      'No matching requests found. Try clearing filters or simulate traffic.'
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-slate-800/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-white">{requests.length}</strong> of{' '}
              <strong className="text-white">{pagination.total}</strong> requests
            </span>

            <select
              value={pagination.limit}
              onChange={(e) => {
                setPagination(prev => ({ ...prev, limit: parseInt(e.target.value, 10), page: 1 }));
              }}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 ml-2"
            >
              <option value="10">10 / page</option>
              <option value="15">15 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>
              Page <strong className="text-white">{pagination.page}</strong> of{' '}
              <strong className="text-white">{pagination.totalPages}</strong>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page <= 1 || loading}
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row Details Modal */}
      {selectedRow && (
        <RequestDetailModal
          request={selectedRow}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
}
