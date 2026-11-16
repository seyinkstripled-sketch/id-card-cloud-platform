'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  CreditCard,
  RefreshCw,
  X,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Building,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import IdCardPreview from '@/components/IdCardPreview';
import { useToast } from '@/components/Toast';
import { StaffRecord, UserSession, CardStatus } from '@/types';

export default function StaffDirectoryPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [viewStaff, setViewStaff] = useState<StaffRecord | null>(null);
  const [editStaff, setEditStaff] = useState<StaffRecord | null>(null);
  const [deleteConfirmStaff, setDeleteConfirmStaff] = useState<StaffRecord | null>(null);

  const { success, error } = useToast();

  // Load user profile
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error(err));
  }, []);

  // Fetch staff list
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (department) params.set('dept', department);
      if (status) params.set('status', status);

      const res = await fetch(`/api/staff?${params.toString()}`);
      const data = await res.json();
      setStaffList(data.staff || []);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      error('Failed to load staff records.');
    } finally {
      setLoading(false);
    }
  }, [search, department, status, error]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Handle Edit submission
  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaff) return;

    try {
      const res = await fetch(`/api/staff/${editStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editStaff),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      success(`Staff member ${editStaff.fullName} updated successfully!`);
      setEditStaff(null);
      fetchStaff();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      error(msg);
    }
  };

  // Handle Delete
  const handleDeleteStaff = async () => {
    if (!deleteConfirmStaff) return;

    try {
      const res = await fetch(`/api/staff/${deleteConfirmStaff.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      success(`Staff record ${deleteConfirmStaff.staffId} deleted.`);
      setDeleteConfirmStaff(null);
      fetchStaff();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      error(msg);
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
                <span>Federal Teaching Hospital</span>
                <span>•</span>
                <span>Staff Registry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Hospital Staff Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage, search, preview, and print official CR80 employee identity cards.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="/api/export/csv"
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </a>

              <Link
                href="/staff/new"
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Issue New Card</span>
              </Link>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by staff ID, full name, or designation..."
                className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">All Departments</option>
                <option value="PLANNING RES. & STATS">Planning, Res. &amp; Stats</option>
                <option value="CLINICAL SERVICES">Clinical Services</option>
                <option value="NURSING SERVICES">Nursing Services</option>
                <option value="FINANCE & ACCOUNTS">Finance &amp; Accounts</option>
                <option value="PHARMACY">Pharmacy</option>
                <option value="ADMINISTRATION">Administration</option>
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
                <option value="SUSPENDED">Suspended</option>
              </select>

              {(search || department || status) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setDepartment('');
                    setStatus('');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Staff Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                <p className="text-xs font-semibold">Loading staff registry...</p>
              </div>
            ) : staffList.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-700">No staff records found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust your search or click &quot;Issue New Card&quot; to onboard staff.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                      <th className="py-3.5 px-4">Staff Member</th>
                      <th className="py-3.5 px-4">Staff ID</th>
                      <th className="py-3.5 px-4">Designation</th>
                      <th className="py-3.5 px-4">Department</th>
                      <th className="py-3.5 px-4">Validity</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffList.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={member.photoUrl || '/assets/sample_photos/fth_staff_portrait.png'}
                                alt={member.fullName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">
                                {member.fullName}
                              </span>
                              <span className="text-[11px] text-slate-500 truncate block">
                                {member.email || 'No email registered'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                          {member.staffId}
                        </td>

                        <td className="py-3 px-4 font-medium text-slate-700">
                          {member.designation}
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {member.department}
                        </td>

                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {new Date(member.expiryDate).toLocaleDateString('en-GB')}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              member.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : member.status === 'EXPIRED'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setViewStaff(member)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Preview CR80 ID Card"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditStaff(member)}
                              className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Record"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {user?.role === 'ADMIN' && (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmStaff(member)}
                                className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
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

      {/* MODAL 1: VIEW CARD PREVIEW MODAL */}
      {viewStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">CR80 ID Card Preview</h3>
                <p className="text-xs text-slate-500">{viewStaff.fullName} ({viewStaff.staffId})</p>
              </div>
              <button
                onClick={() => setViewStaff(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center py-2">
              <IdCardPreview staff={viewStaff} />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/verify/${viewStaff.qrVerificationCode || viewStaff.staffId}`}
                target="_blank"
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Open Verification Portal ↗
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STAFF RECORD MODAL */}
      {editStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Edit Staff Record</h3>
                <p className="text-xs text-slate-500">Update official credentials for {editStaff.staffId}</p>
              </div>
              <button
                onClick={() => setEditStaff(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editStaff.fullName}
                  onChange={(e) => setEditStaff({ ...editStaff, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={editStaff.designation}
                    onChange={(e) => setEditStaff({ ...editStaff, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={editStaff.department}
                    onChange={(e) => setEditStaff({ ...editStaff, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editStaff.status}
                    onChange={(e) => setEditStaff({ ...editStaff, status: e.target.value as CardStatus })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="REVOKED">REVOKED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={editStaff.bloodGroup || ''}
                    onChange={(e) => setEditStaff({ ...editStaff, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditStaff(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION MODAL */}
      {deleteConfirmStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete staff member{' '}
                <span className="font-bold text-slate-800">{deleteConfirmStaff.fullName}</span> (
                {deleteConfirmStaff.staffId})? This action will permanently remove their credentials.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmStaff(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStaff}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
