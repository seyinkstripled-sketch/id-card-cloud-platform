'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Palette,
  Camera,
  PenTool,
  Printer,
  Download,
  RotateCcw,
  Move,
  Layers,
  Sparkles,
  Users,
  Check,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import IdCardPreview from '@/components/IdCardPreview';
import PassportCameraModal from '@/components/PassportCameraModal';
import SignaturePadModal from '@/components/SignaturePadModal';
import { StaffRecord, UserSession } from '@/types';

export default function CardStudioPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Partial<StaffRecord>>({
    staffId: 'P6014',
    fullName: 'AJAYI EMMANUEL I.',
    designation: 'Asst. Data Processing Officer',
    department: 'PLANNING RES. & STATS',
    expiryDate: '2025-12-31',
    photoUrl: '/assets/sample_photos/fth_staff_portrait.png',
    signatureUrl: '/assets/sample_photos/fth_signature_white.png',
  });

  const [interactiveMode, setInteractiveMode] = useState(true);
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [zoomScale, setZoomScale] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSigPadOpen, setIsSigPadOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error(err));

    fetch('/api/staff')
      .then((res) => res.json())
      .then((data) => {
        if (data.staff && data.staff.length > 0) {
          setStaffList(data.staff);
          setSelectedStaff(data.staff[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSelectStaff = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = staffList.find((s) => s.id === e.target.value);
    if (found) setSelectedStaff(found);
  };

  const handlePrint = () => {
    window.print();
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs print:hidden">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <span>Interactive Card Designer</span>
                <span>•</span>
                <span>CR80 Master Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Card Customizer &amp; Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fine-tune moveable and resizable elements, test passport camera capture, and export vector graphics.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Card</span>
              </button>
            </div>
          </div>

          {/* Studio Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Control Panel (Left 5 Cols) */}
            <div className="lg:col-span-5 space-y-6 print:hidden">
              {/* Profile Picker */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Select Staff Profile</span>
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Load Existing Record:
                  </label>
                  <select
                    value={selectedStaff.id || ''}
                    onChange={handleSelectStaff}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    {staffList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.staffId} — {m.fullName} ({m.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Staff Full Name
                    </label>
                    <input
                      type="text"
                      value={selectedStaff.fullName || ''}
                      onChange={(e) =>
                        setSelectedStaff({ ...selectedStaff, fullName: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Staff ID
                      </label>
                      <input
                        type="text"
                        value={selectedStaff.staffId || ''}
                        onChange={(e) =>
                          setSelectedStaff({ ...selectedStaff, staffId: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 text-slate-900 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={selectedStaff.department || ''}
                        onChange={(e) =>
                          setSelectedStaff({ ...selectedStaff, department: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Moveable & Adjustability Controls */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                    <Move className="w-4 h-4" />
                    <span>Moveable Elements Tuning</span>
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={interactiveMode}
                      onChange={(e) => setInteractiveMode(e.target.checked)}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-700">Enable Tuning</span>
                  </label>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Click on the Passport photo, Name banner, Details box, QR code box, or Footer on the card preview to adjust positioning directly with directional arrows.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Webcam Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSigPadOpen(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <PenTool className="w-4 h-4 text-emerald-400" />
                    <span>Draw Signature</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stage Canvas (Right 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xl flex flex-col items-center">
                <IdCardPreview
                  staff={selectedStaff}
                  interactive={interactiveMode}
                  scale={zoomScale}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <PassportCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(photo) => setSelectedStaff({ ...selectedStaff, photoUrl: photo })}
      />

      <SignaturePadModal
        isOpen={isSigPadOpen}
        onClose={() => setIsSigPadOpen(false)}
        onSave={(sig) => setSelectedStaff({ ...selectedStaff, signatureUrl: sig })}
      />
    </div>
  );
}
