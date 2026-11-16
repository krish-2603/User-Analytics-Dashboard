import React from 'react';
import { X, Globe, Shield, Clock, Laptop, Eye, Compass, Activity } from 'lucide-react';

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function RequestDetailModal({ request, onClose }) {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">{getFlagEmoji(request.country_code)}</span>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Request Details
                <span className="text-xs font-mono font-normal text-slate-400">
                  ({request.request_id || `ID: #${request.id}`})
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {request.country_name} ({request.country_code}) • {request.city || 'City N/A'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* IP & Geo Banner */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-slate-400 block">IP Address</span>
              <span className="font-mono font-bold text-blue-400 text-sm">{request.ip_address}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Country</span>
              <span className="font-medium text-slate-200">{request.country_name}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">City / Continent</span>
              <span className="font-medium text-slate-200">
                {request.city || 'N/A'}, {request.continent || 'Global'}
              </span>
            </div>
            {request.latitude && request.longitude && (
              <div>
                <span className="text-[11px] text-slate-400 block">Coordinates</span>
                <span className="font-mono text-slate-300">
                  {request.latitude.toFixed(2)}°, {request.longitude.toFixed(2)}°
                </span>
              </div>
            )}
            <div>
              <span className="text-[11px] text-slate-400 block">HTTP Status</span>
              <span className="font-mono font-bold text-emerald-400">
                {request.status_code || 200} OK
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Latency</span>
              <span className="font-mono text-amber-400 font-semibold">
                {request.response_time_ms || 42} ms
              </span>
            </div>
          </div>

          {/* Client & Device Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Client & Session Profile
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  Browser
                </span>
                <p className="font-medium text-slate-200">{request.browser}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                  Operating System
                </span>
                <p className="font-medium text-slate-200">
                  {request.os} <span className="text-slate-400">({request.device_type || 'Desktop'})</span>
                </p>
              </div>
            </div>
          </div>

          {/* Web Page & Navigation Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Page Navigation
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 space-y-2">
              <div>
                <span className="text-slate-400 block">Target Page Visited:</span>
                <span className="font-mono text-blue-400 font-semibold bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/50 inline-block mt-0.5">
                  {request.page_visited}
                </span>
              </div>
              {request.page_title && (
                <div>
                  <span className="text-slate-400 block">Page Title:</span>
                  <span className="text-slate-200">{request.page_title}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400 block">Referrer:</span>
                <span className="text-slate-300 font-mono text-[11px] break-all">
                  {request.referrer || 'Direct Visit'}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamp Info */}
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Recorded At (UTC):
            </span>
            <span className="font-mono text-slate-200">{request.timestamp}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/50 border-t border-slate-700/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
