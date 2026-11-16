'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  CreditCard,
  AlertTriangle,
  FileCheck,
  UserPlus,
  Palette,
  Download,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Building2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StatsCard from '@/components/StatsCard';
import { UserSession, DashboardAnalytics, AuditLogRecord } from '@/types';

export default function DashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Load user session and analytics data
  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, analyticsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/analytics'),
        ]);

        if (userRes.status === 401) {
          router.push('/login');
          return;
        }

        const userData = await userRes.json();
        const analyticsData = await analyticsRes.json();

        setUser(userData.user);
        setAnalytics(analyticsData.analytics || null);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

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
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <span>Federal Teaching Hospital, Ido-Ekiti</span>
                <span>•</span>
                <span>ID Studio Cloud</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Executive Issuance Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time metrics, active credentials lifecycle, and security issuance audit.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/staff/new"
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Issue New Card</span>
              </Link>
              <Link
                href="/studio"
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-950/20 transition-all"
              >
                <Palette className="w-4 h-4 text-emerald-400" />
                <span>Card Studio</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
              <p className="text-xs font-semibold">Loading platform analytics...</p>
            </div>
          ) : (
            <>
              {/* Top Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Hospital Staff"
                  value={analytics?.totalStaff ?? 0}
                  icon={Users}
                  colorScheme="blue"
                  change="+4 newly onboarded"
                />
                <StatsCard
                  title="Active ID Cards"
                  value={analytics?.activeCards ?? 0}
                  icon={CreditCard}
                  colorScheme="emerald"
                  change="Verified in circulation"
                />
                <StatsCard
                  title="Expired Cards"
                  value={analytics?.expiredCards ?? 0}
                  icon={AlertTriangle}
                  colorScheme="amber"
                  isPositive={false}
                  change="Renewal alert active"
                />
                <StatsCard
                  title="Security Audit Events"
                  value={analytics?.recentLogs?.length ?? 0}
                  icon={FileCheck}
                  colorScheme="purple"
                  change="Continuous logging"
                />
              </div>

              {/* Department Distribution & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Department Distribution (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Staff Distribution by Department
                      </h2>
                      <p className="text-xs text-slate-500">
                        Hospital clinical, administration, and technical directorates
                      </p>
                    </div>
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="space-y-3 pt-2">
                    {analytics?.departmentStats && analytics.departmentStats.length > 0 ? (
                      analytics.departmentStats.map((dept: { department: string; count: number }, index: number) => {
                        const total = analytics.totalStaff || 1;
                        const pct = Math.round((dept.count / total) * 100);
                        return (
                          <div key={dept.department} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-slate-800">{dept.department}</span>
                              <span className="text-slate-500 font-mono">
                                {dept.count} staff ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  index % 3 === 0
                                    ? 'bg-emerald-600'
                                    : index % 3 === 1
                                    ? 'bg-blue-600'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.max(pct, 12)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 py-4 text-center">
                        No department data available.
                      </p>
                    )}
                  </div>
                </div>

                {/* Operations & Quick Tools */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Issuance Tools</h2>
                    <p className="text-xs text-slate-500">Instant workflow shortcuts</p>

                    <div className="mt-4 space-y-2.5">
                      <Link
                        href="/staff"
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Staff Registry
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Search, filter &amp; edit cards
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                      </Link>

                      <a
                        href="/api/export/csv"
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                            <Download className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Export CSV Directory
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Download spreadsheet
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-colors" />
                      </a>

                      <Link
                        href="/verify/P6014"
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 text-purple-800 rounded-xl">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Public Verify Portal
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Test QR code verification
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition-colors" />
                      </Link>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-800 text-white text-xs">
                    <span className="font-bold block mb-1">Authentic Master Artwork</span>
                    <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                      All cards generate standard ISO/IEC 7810 portrait dimensions (53.98 × 85.60 mm) at 300 DPI with vector text.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Audit Activity Trail */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Recent Security &amp; Activity Log
                    </h2>
                    <p className="text-xs text-slate-500">
                      Immutable trail of card issuance, logins, and QR verifications
                    </p>
                  </div>
                  <Link
                    href="/audit-logs"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    View All Logs →
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Details</th>
                        <th className="py-2.5 px-3">IP Address</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {analytics?.recentLogs && analytics.recentLogs.length > 0 ? (
                        analytics.recentLogs.slice(0, 6).map((audit: AuditLogRecord) => (
                          <tr key={audit.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  audit.action.includes('CREATED') || audit.action.includes('ISSUED')
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : audit.action.includes('LOGIN')
                                    ? 'bg-blue-100 text-blue-800'
                                    : audit.action.includes('VERIFIED')
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                {audit.action}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                              {audit.details}
                            </td>
                            <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                              {audit.ipAddress || '127.0.0.1'}
                            </td>
                            <td className="py-3 px-3 text-slate-500">
                              {new Date(audit.createdAt).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400">
                            No recent audit logs recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
