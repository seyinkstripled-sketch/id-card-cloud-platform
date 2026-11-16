'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  ShieldCheck,
  Search,
  Sparkles,
  Camera,
  PenTool,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  FileCheck,
} from 'lucide-react';
import IdCardPreview from '@/components/IdCardPreview';

export default function HomePage() {
  const [searchCode, setSearchCode] = useState('');
  const router = useRouter();

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      router.push(`/verify/${encodeURIComponent(searchCode.trim())}`);
    }
  };

  const sampleStaff = {
    staffId: 'P6014',
    fullName: 'AJAYI EMMANUEL I.',
    designation: 'Asst. Data Processing Officer',
    department: 'PLANNING RES. & STATS',
    expiryDate: '2025-12-31',
    photoUrl: '/assets/sample_photos/fth_staff_portrait.png',
    signatureUrl: '/assets/sample_photos/fth_signature_white.png',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-950/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-lg">
                ID Studio <span className="text-emerald-700">Cloud</span>
              </span>
              <span className="text-[11px] text-slate-500 block font-medium">
                Federal Teaching Hospital, Ido-Ekiti
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/verify/P6014"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-200 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Public Verification</span>
            </Link>

            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              Sign In
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 transition-all"
            >
              <span>Access Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/40 via-emerald-50/20 to-transparent pointer-events-none -z-10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next-Gen Hospital Credentialing Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Enterprise ID Issuance, Management &amp; Real-Time Verification
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Streamlining official CR80 staff credentials for Federal Teaching Hospital, Ido-Ekiti. Featuring camera photo capture with automated background whitening, digital signature pads, QR verification, and comprehensive audit trails.
              </p>

              {/* Quick Verification Lookup Bar */}
              <div className="max-w-md mx-auto lg:mx-0 pt-2">
                <form
                  onSubmit={handleQuickVerify}
                  className="flex items-center p-1.5 rounded-2xl bg-white border border-slate-300 shadow-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500"
                >
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="Enter Staff ID (e.g. P6014) to verify..."
                    className="w-full px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                  >
                    Verify Card
                  </button>
                </form>
                <div className="mt-2 text-left text-[11px] text-slate-500">
                  Try sample: <span className="font-mono text-emerald-700 font-bold cursor-pointer" onClick={() => setSearchCode('P6014')}>P6014</span> or <span className="font-mono text-emerald-700 font-bold cursor-pointer" onClick={() => setSearchCode('P6015')}>P6015</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/login"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-slate-950/20 transition-all flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Launch Management Studio</span>
                </Link>

                <Link
                  href="/verify/P6014"
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Public QR Scanner Portal</span>
                </Link>
              </div>

              {/* Quick Feature Badges */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CR80 ISO/IEC 7810</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Webcam White-Bg</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tamper-Proof QR</span>
                </div>
              </div>
            </div>

            {/* Right Live Card Preview Hero Stage */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="p-3 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-2xl">
                <IdCardPreview staff={sampleStaff} />
              </div>
              <p className="mt-3 text-xs text-slate-500 font-medium">
                Live Interactive Rendering — Federal Teaching Hospital Master Spec
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Grid */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Complete Issuance Lifecycle
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Built for Security, Usability, and Hospital Scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Live Webcam &amp; White Background
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct camera capture from browser with real-time face alignment oval and automated algorithm to whiten backgrounds for passport specifications.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Digital Signature Pad
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Touch and mouse signature drawing pad with high-DPI stroke smoothing, generating transparent signature graphics placed on the green card footer.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Instant QR Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Publicly accessible verification portal where any smartphone or scanner can verify staff identity, validity, and credentials instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Evaluation Access
              </span>
              <h3 className="text-xl font-bold mt-1">Pre-Seeded Demonstration Accounts</h3>
              <p className="text-xs text-slate-400 mt-1">
                Admin: <code className="text-emerald-300 font-mono">admin@idstudio.gov.ng</code> (Pass: <code className="text-emerald-300 font-mono">Admin123!@#</code>) | Operator: <code className="text-emerald-300 font-mono">operator@idstudio.gov.ng</code>
              </p>
            </div>

            <Link
              href="/login"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors shrink-0"
            >
              Sign In To System
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-200">Federal Teaching Hospital, Ido-Ekiti</span> — Official Identity Management Platform.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/verify/P6014" className="hover:text-white transition-colors">
              Public Portal
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Portal Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
