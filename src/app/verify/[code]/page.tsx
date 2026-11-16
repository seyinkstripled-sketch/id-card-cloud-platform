'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  Lock,
  User,
  Clock,
  Printer,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

interface VerificationResult {
  verified: boolean;
  staff: {
    id: string;
    staffId: string;
    fullName: string;
    designation: string;
    department: string;
    bloodGroup?: string;
    issueDate: string;
    expiryDate: string;
    status: string;
    photoUrl?: string;
    signatureUrl?: string;
    qrVerificationCode: string;
    barcodeData?: string;
  };
  verifiedAt: string;
  institution: string;
}

function VerifyContent() {
  const params = useParams();
  const code = (params?.code as string) || '';

  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    fetch(`/api/verify/${encodeURIComponent(code)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Identity record could not be verified.');
        }
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Verification failed');
      })
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-700 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Validating Cryptographic Record...</h2>
        <p className="text-xs text-slate-500">Querying live Federal Teaching Hospital registry</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Invalid / Unverified Credential
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            Card Record Not Found
          </h2>
          <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
            The identifier <span className="font-mono font-bold text-slate-900">{code}</span> does not match any active credential in the Federal Teaching Hospital registry. This card may be revoked, expired, or counterfeit.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition-colors"
          >
            Return to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
      {/* Top Verified Ribbon */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <CheckCircle2 className="w-9 h-9 text-white" />
        </div>
        <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 bg-white/20 rounded-full border border-white/30 text-emerald-100">
          Official Credential Verified
        </span>
        <h2 className="text-2xl font-black text-white mt-2">
          {result.staff.fullName}
        </h2>
        <p className="text-xs text-emerald-200 font-mono mt-1 font-bold">
          Staff ID: {result.staff.staffId}
        </p>
      </div>

      {/* Profile & Photo Row */}
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="w-20 h-24 rounded-xl bg-white border-2 border-emerald-800 overflow-hidden shadow-sm shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.staff.photoUrl || '/assets/sample_photos/fth_staff_portrait.png'}
              alt={result.staff.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Official Appointment
            </span>
            <h3 className="text-sm font-extrabold text-slate-900">
              {result.staff.designation}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>{result.staff.department}</span>
            </div>
          </div>
        </div>

        {/* Credential Data Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Card Status
            </span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{result.staff.status}</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Blood Group
            </span>
            <span className="font-bold text-slate-900">
              {result.staff.bloodGroup || 'Not Specified'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Issuance Date
            </span>
            <span className="font-semibold text-slate-800 font-mono">
              {new Date(result.staff.issueDate).toLocaleDateString('en-GB')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Card Expiration
            </span>
            <span className="font-semibold text-slate-800 font-mono">
              {new Date(result.staff.expiryDate).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>

        {/* Cryptographic Verification Footer */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-900">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Digital Security Signature:</span>
            </div>
            <span className="font-mono text-emerald-800">SHA256-AUTHENTIC</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-800/80">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Scanned Verification Time:</span>
            </div>
            <span className="font-mono">
              {new Date(result.verifiedAt).toLocaleTimeString('en-GB')}
            </span>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate of Authenticity</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PublicVerifyPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base block leading-tight">
                Federal Teaching Hospital, Ido-Ekiti
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider">
                Official Public Verification Portal
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Verification Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <Suspense
          fallback={
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-700 mx-auto" />
              <h2 className="text-base font-bold text-slate-900">Loading Portal...</h2>
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </main>
    </div>
  );
}
