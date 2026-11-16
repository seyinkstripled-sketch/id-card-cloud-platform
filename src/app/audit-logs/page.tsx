'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileClock,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Lock,
  User,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { UserSession, AuditLogRecord } from '@/types';

export default function AuditLogsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error(err));

    fetchLogs();
  }, [actionFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = actionFilter
        ? `/api/audit-logs?action=${encodeURIComponent(actionFilter)}`
        : '/api/audit-logs';
      const res = await fetch(url);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex">
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <span>Security Governance</span>
                <span>•</span>
                <span>Immutable Audit Logs</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Security Audit Trail
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time tracking of card issuance, database modifications, administrator sessions, and verification scans.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">All Actions</option>
                <option value="USER_LOGIN">User Logins</option>
                <option value="STAFF_CREATED">Cards Created</option>
                <option value="STAFF_UPDATED">Cards Updated</option>
                <option value="STAFF_DELETED">Cards Deleted</option>
                <option value="CARD_VERIFIED">QR Verifications</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                <p className="text-xs font-semibold">Loading security audit records...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <FileClock className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-700">No audit logs matching query</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                      <th className="py-3.5 px-4">Event Type</th>
                      <th className="py-3.5 px-4">Event Details</th>
                      <th className="py-3.5 px-4">Origin IP</th>
                      <th className="py-3.5 px-4">Initiating Identity</th>
                      <th className="py-3.5 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              log.action.includes('CREATED')
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : log.action.includes('LOGIN')
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : log.action.includes('DELETED')
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : log.action.includes('VERIFIED')
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-slate-100 text-slate-800 border border-slate-300'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 font-medium max-w-md">
                          {log.details}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {log.ipAddress || '127.0.0.1'}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          {log.user ? (
                            <span className="font-bold text-slate-800">{log.user.name}</span>
                          ) : (
                            <span className="text-slate-400 italic">System / Public</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
