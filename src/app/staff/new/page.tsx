'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  Camera,
  PenTool,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Phone,
  Mail,
  Droplet,
  User,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import IdCardPreview from '@/components/IdCardPreview';
import PassportCameraModal from '@/components/PassportCameraModal';
import SignaturePadModal from '@/components/SignaturePadModal';
import { useToast } from '@/components/Toast';
import { UserSession } from '@/types';

export default function NewCardPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [staffId, setStaffId] = useState('P6018');
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('PLANNING RES. & STATS');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [photoUrl, setPhotoUrl] = useState<string>('/assets/sample_photos/fth_staff_portrait.png');
  const [signatureUrl, setSignatureUrl] = useState<string>('/assets/sample_photos/fth_signature_white.png');
  const [notes, setNotes] = useState('');

  // Modals
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSigPadOpen, setIsSigPadOpen] = useState(false);

  const router = useRouter();
  const { success, error } = useToast();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const payload = {
        staffId: staffId.trim().toUpperCase(),
        fullName: fullName.trim(),
        designation: designation.trim(),
        department: department.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        bloodGroup: bloodGroup || undefined,
        expiryDate: new Date(expiryDate).toISOString(),
        photoUrl,
        signatureUrl,
        notes: notes.trim() || undefined,
      };

      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to issue card');

      success(`Official card for ${payload.fullName} (${payload.staffId}) issued successfully!`);
      router.push('/staff');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error issuing card';
      setErrorMsg(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  const previewStaff = {
    staffId: staffId || 'P6018',
    fullName: fullName || 'FULL NAME HERE',
    designation: designation || 'Staff Designation',
    department: department || 'Department Name',
    expiryDate: new Date(expiryDate),
    photoUrl,
    signatureUrl,
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
                <span>Card Issuance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Issue Official Staff ID Card
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Capture live passport photo with white background, draw digital signature, and issue credentials.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form and Live Card Stage Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Basic Identifiers */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <User className="w-4 h-4" />
                    <span>Personal &amp; Credential Info</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Staff ID Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value.toUpperCase())}
                        placeholder="P6018"
                        className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 uppercase focus:ring-2 focus:ring-emerald-600 text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name (Surname First) *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. AJAYI EMMANUEL I."
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Official Designation *
                      </label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Asst. Data Processing Officer"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department / Directorate *
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 text-slate-900 bg-white"
                      >
                        <option value="PLANNING RES. & STATS">Planning, Res. &amp; Stats</option>
                        <option value="CLINICAL SERVICES">Clinical Services</option>
                        <option value="NURSING SERVICES">Nursing Services</option>
                        <option value="FINANCE & ACCOUNTS">Finance &amp; Accounts</option>
                        <option value="PHARMACY">Pharmacy</option>
                        <option value="MEDICAL LABORATORY">Medical Laboratory</option>
                        <option value="ADMINISTRATION">Administration</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Passport & Signature Tools */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Camera className="w-4 h-4" />
                    <span>Biometric Passport &amp; Signature</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Passport Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Passport Photo</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Auto-White Bg
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-14 h-16 rounded-lg bg-white border border-slate-300 overflow-hidden shadow-xs shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photoUrl}
                            alt="Passport Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <button
                            type="button"
                            onClick={() => setIsCameraOpen(true)}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Capture with Camera</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Signature Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Holder Signature</span>
                        <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Digital Pad
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg bg-[#014e24] border border-emerald-900 flex items-center justify-center p-1 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={signatureUrl}
                            alt="Signature Preview"
                            className="max-h-full max-w-full object-contain brightness-200"
                          />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <button
                            type="button"
                            onClick={() => setIsSigPadOpen(true)}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Draw Signature</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Additional Metadata */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Validity &amp; Health Info</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 text-slate-900 bg-white"
                      >
                        <option value="O+">O+ (Positive)</option>
                        <option value="O-">O- (Negative)</option>
                        <option value="A+">A+ (Positive)</option>
                        <option value="A-">A- (Negative)</option>
                        <option value="B+">B+ (Positive)</option>
                        <option value="B-">B- (Negative)</option>
                        <option value="AB+">AB+ (Positive)</option>
                        <option value="AB-">AB- (Negative)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Card Expiry Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 123 4567"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/staff"
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 disabled:opacity-50 transition-all"
                  >
                    {loading ? (
                      <span>Generating Card...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Issue Official ID Card</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Live Card Stage */}
            <div className="lg:col-span-5 flex flex-col items-center sticky top-24">
              <div className="p-3 bg-white rounded-3xl border border-slate-200/80 shadow-xl">
                <IdCardPreview staff={previewStaff} />
              </div>
              <p className="mt-2 text-xs text-slate-500 font-medium">
                Live Preview updates automatically as you type.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <PassportCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(photo) => setPhotoUrl(photo)}
      />

      <SignaturePadModal
        isOpen={isSigPadOpen}
        onClose={() => setIsSigPadOpen(false)}
        onSave={(sig) => setSignatureUrl(sig)}
      />
    </div>
  );
}
