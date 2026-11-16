'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { StaffRecord } from '@/types';
import {
  Download,
  Printer,
  RotateCcw,
  Move,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ElementPosition {
  x: number; // percentage (0 to 100) or mm
  y: number;
  width?: number;
  height?: number;
}

interface IdCardPreviewProps {
  staff: Partial<StaffRecord>;
  showBack?: boolean;
  interactive?: boolean; // moveable / adjustable boxes mode
  scale?: number;
  onLayoutChange?: (layout: Record<string, ElementPosition>) => void;
}

const DEFAULT_POSITIONS: Record<string, ElementPosition> = {
  header: { x: 0, y: 0, width: 100, height: 13 },
  photo: { x: 26, y: 15, width: 48, height: 32 },
  staffId: { x: 0, y: 48, width: 100, height: 4 },
  nameBanner: { x: 6, y: 53, width: 88, height: 7 },
  details: { x: 6, y: 61, width: 60, height: 19 },
  qrCode: { x: 68, y: 61, width: 26, height: 19 },
  footer: { x: 0, y: 82, width: 100, height: 18 },
};

export default function IdCardPreview({
  staff,
  showBack = false,
  interactive = false,
  scale = 1,
  onLayoutChange,
}: IdCardPreviewProps) {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>(showBack ? 'back' : 'front');
  const [positions, setPositions] = useState<Record<string, ElementPosition>>(DEFAULT_POSITIONS);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Sync side if showBack prop changes
  useEffect(() => {
    setActiveSide(showBack ? 'back' : 'front');
  }, [showBack]);

  // Generate QR Code data URL
  useEffect(() => {
    const code = staff.qrVerificationCode || staff.staffId || 'P6014';
    const verifyUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/verify/${code}`
        : `https://fthidoekiti.gov.ng/verify/${code}`;

    QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#036029',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [staff.qrVerificationCode, staff.staffId]);

  // Reset positions to authentic default
  const handleResetLayout = () => {
    setPositions(DEFAULT_POSITIONS);
    if (onLayoutChange) onLayoutChange(DEFAULT_POSITIONS);
  };

  // Adjust position for interactive dragging
  const handleMove = (key: string, deltaX: number, deltaY: number) => {
    setPositions((prev) => {
      const current = prev[key] || { x: 0, y: 0 };
      const updated = {
        ...prev,
        [key]: {
          ...current,
          x: Math.max(0, Math.min(90, current.x + deltaX)),
          y: Math.max(0, Math.min(90, current.y + deltaY)),
        },
      };
      if (onLayoutChange) onLayoutChange(updated);
      return updated;
    });
  };

  // Print Card
  const handlePrint = () => {
    window.print();
  };

  const staffName = (staff.fullName || 'AJAYI EMMANUEL I.').toUpperCase();
  const staffId = staff.staffId || 'P6014';
  const designation = staff.designation || 'Asst. Data Processing Officer';
  const department = staff.department || 'PLANNING RES. & STATS';
  const expiryDate = staff.expiryDate
    ? new Date(staff.expiryDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '31/12/2025';

  const photoUrl = staff.photoUrl || '/assets/sample_photos/fth_staff_portrait.png';
  const signatureUrl = staff.signatureUrl || '/assets/sample_photos/fth_signature_white.png';

  return (
    <div className="flex flex-col items-center">
      {/* View & Side Control Toolbar */}
      <div className="flex items-center gap-2 mb-4 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <button
          type="button"
          onClick={() => setActiveSide('front')}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeSide === 'front'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Front Side
        </button>
        <button
          type="button"
          onClick={() => setActiveSide('back')}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeSide === 'back'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Back Side
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          title="Print CR80 Card"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print</span>
        </button>

        {interactive && (
          <button
            type="button"
            onClick={handleResetLayout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Reset Elements"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* CR80 Card Stage (Aspect ratio 53.98mm x 85.60mm ≈ 336px x 534px) */}
      <div
        ref={cardRef}
        id="cr80-card-render-stage"
        style={{
          width: '336px',
          height: '534px',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
        className="relative bg-white rounded-[16px] shadow-2xl border border-slate-300/80 overflow-hidden select-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* ================= FRONT SIDE ================= */}
        {activeSide === 'front' ? (
          <div className="relative w-full h-full flex flex-col justify-between bg-[#F8FAFC]">
            {/* Background Guilloche Watermark Pattern */}
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none bg-repeat"
              style={{
                backgroundImage: 'url(/assets/patterns/fth_guilloche_watermark.png)',
                backgroundSize: '120px',
              }}
            />

            {/* 1. TOP HEADER SECTION */}
            <div
              className={`relative z-10 w-full bg-[#036029] text-white px-3 py-2.5 flex items-center gap-2.5 shadow-sm ${
                interactive && selectedElement === 'header'
                  ? 'ring-2 ring-amber-400'
                  : ''
              }`}
              onClick={() => interactive && setSelectedElement('header')}
            >
              {/* Hospital Logo */}
              <div className="relative w-9 h-9 shrink-0 bg-white/10 rounded-full p-0.5 border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/icons/fth_logo.png"
                  alt="FTH Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Hospital Institution Text */}
              <div className="flex-1 min-w-0 leading-tight">
                <h1 className="text-[11.5px] font-black tracking-tight text-white uppercase truncate">
                  FEDERAL TEACHING HOSPITAL
                </h1>
                <p className="text-[9px] font-bold text-emerald-200 tracking-wider uppercase truncate">
                  IDO-EKITI, EKITI STATE
                </p>
              </div>

              {/* Nigerian Green Ribbon Accent */}
              <div className="w-1.5 h-7 rounded-full bg-[#A7F3D0] opacity-80 shrink-0" />
            </div>

            {/* Sub-Header Gold Divider */}
            <div className="h-0.5 w-full bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />

            {/* 2. PASSPORT PHOTO & STAFF ID */}
            <div className="relative z-10 flex flex-col items-center mt-2.5">
              <div
                className={`relative w-[130px] h-[155px] rounded-lg overflow-hidden bg-white shadow-md border-2 border-emerald-800 ${
                  interactive && selectedElement === 'photo'
                    ? 'ring-2 ring-amber-400'
                    : ''
                }`}
                onClick={() => interactive && setSelectedElement('photo')}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Staff Portrait"
                  className="w-full h-full object-cover bg-white"
                />
              </div>

              {/* Staff ID Pill Badge */}
              <div className="mt-1.5 px-3 py-0.5 rounded-full bg-slate-900 text-white font-mono font-bold text-[11px] tracking-wider shadow-xs">
                {staffId}
              </div>
            </div>

            {/* 3. NAME BANNER (User requirement: Green Background, clean name, no text below) */}
            <div className="relative z-10 px-4 mt-2">
              <div
                className={`relative w-full bg-[#036029] rounded-md py-1.5 px-2 flex items-center justify-between shadow-sm border border-emerald-700 ${
                  interactive && selectedElement === 'nameBanner'
                    ? 'ring-2 ring-amber-400'
                    : ''
                }`}
                onClick={() => interactive && setSelectedElement('nameBanner')}
              >
                {/* 3 Mint Accents Left */}
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-3.5 bg-[#A7F3D0] rounded-xs" />
                  <div className="w-1 h-3.5 bg-[#A7F3D0] rounded-xs" />
                  <div className="w-1 h-3.5 bg-[#A7F3D0] rounded-xs" />
                </div>

                {/* Staff Full Name (Centered & Bold White) */}
                <span className="text-[11.5px] font-black text-white tracking-wide text-center uppercase truncate px-1">
                  {staffName}
                </span>

                {/* 3 Mint Accents Right */}
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-3.5 bg-[#A7F3D0] rounded-xs" />
                  <div className="w-1 h-3.5 bg-[#A7F3D0] rounded-xs" />
                  <div className="w-1 h-3.5 bg-[#A7F3D0] rounded-xs" />
                </div>
              </div>
            </div>

            {/* 4. DETAILS ROW (Icons + Designation, Department, Expiry) & QR CODE */}
            <div className="relative z-10 px-4 mt-2 flex items-center justify-between gap-2">
              {/* Left Details List */}
              <div className="flex-1 space-y-1.5 min-w-0">
                {/* Designation */}
                <div className="flex items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/icons/icon_designation.png"
                    alt="Designation"
                    className="w-3.5 h-3.5 shrink-0 opacity-80"
                  />
                  <span className="text-[9.5px] font-bold text-slate-900 truncate">
                    {designation}
                  </span>
                </div>

                {/* Department */}
                <div className="flex items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/icons/icon_department.png"
                    alt="Department"
                    className="w-3.5 h-3.5 shrink-0 opacity-80"
                  />
                  <span className="text-[9px] font-bold text-slate-800 truncate">
                    Dept.: {department}
                  </span>
                </div>

                {/* Expiry Date */}
                <div className="flex items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/icons/icon_calendar.png"
                    alt="Expiry"
                    className="w-3.5 h-3.5 shrink-0 opacity-80"
                  />
                  <span className="text-[9px] font-bold text-slate-800">
                    Exp. Date: {expiryDate}
                  </span>
                </div>
              </div>

              {/* Right Verification QR Code Box */}
              <div
                className={`relative w-[68px] h-[68px] rounded-lg bg-white p-1 border border-slate-200 shadow-xs flex items-center justify-center shrink-0 ${
                  interactive && selectedElement === 'qrCode'
                    ? 'ring-2 ring-amber-400'
                    : ''
                }`}
                onClick={() => interactive && setSelectedElement('qrCode')}
              >
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="Verification QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 animate-pulse rounded" />
                )}
              </div>
            </div>

            {/* 5. BOTTOM FOOTER SECTION (Deep Green, Coat of Arms & Signature) */}
            <div
              className={`relative z-10 w-full bg-[#014e24] text-white px-4 py-2 mt-auto flex items-center justify-between border-t border-emerald-900 ${
                interactive && selectedElement === 'footer'
                  ? 'ring-2 ring-amber-400'
                  : ''
              }`}
              onClick={() => interactive && setSelectedElement('footer')}
            >
              {/* Nigerian Coat of Arms */}
              <div className="w-10 h-10 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/icons/nigerian_coat_of_arms.png"
                  alt="Coat of Arms"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Holder Signature Graphic & Line */}
              <div className="flex flex-col items-center w-36">
                <div className="h-6 w-full flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={signatureUrl}
                    alt="Holder Signature"
                    className="max-h-6 max-w-full object-contain brightness-200"
                  />
                </div>
                <div className="w-full border-b border-white/60 my-0.5" />
                <span className="text-[7.5px] font-semibold text-emerald-100 uppercase tracking-wider">
                  Holder&apos;s Signature
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= BACK SIDE ================= */
          <div className="relative w-full h-full flex flex-col justify-between bg-[#F8FAFC] text-slate-800 p-0">
            {/* Back Header */}
            <div className="w-full bg-[#036029] text-white py-2.5 px-3 text-center shadow-xs">
              <h2 className="text-[10px] font-extrabold uppercase tracking-wide">
                FEDERAL TEACHING HOSPITAL, IDO-EKITI
              </h2>
            </div>

            {/* Terms & Conditions Body */}
            <div className="p-4 space-y-3.5 text-center flex-1 flex flex-col justify-center">
              <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/60">
                <p className="text-[9px] font-semibold text-slate-800 leading-relaxed">
                  This identity card remains the official property of Federal Teaching Hospital, Ido-Ekiti, Ekiti State, Nigeria.
                </p>
              </div>

              <div className="text-[8.5px] text-slate-600 leading-relaxed space-y-1">
                <p>
                  It must be worn or displayed during official duty hours and produced upon request by authorised personnel.
                </p>
                <p className="font-medium text-slate-700">
                  If found, please return to the nearest police station or to:
                </p>
                <p className="font-bold text-slate-900 text-[9px]">
                  Office of the Chief Medical Director (CMD)<br />
                  Federal Teaching Hospital, P.M.B. 201, Ido-Ekiti
                </p>
              </div>

              {/* Barcode Display */}
              <div className="py-2 flex flex-col items-center justify-center">
                {/* SVG Barcode Mockup */}
                <div className="h-10 w-48 flex items-center justify-between px-2 bg-white border border-slate-200 rounded">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black h-8"
                      style={{
                        width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px',
                      }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] font-bold text-slate-800 mt-1">
                  *{staffId}*
                </span>
              </div>
            </div>

            {/* Authorised Signatory Footer */}
            <div className="w-full bg-slate-100 border-t border-slate-200 py-2.5 px-4 text-center">
              <div className="w-32 border-b border-slate-400 mx-auto mb-1" />
              <span className="text-[8.5px] font-bold text-slate-800 uppercase tracking-wider block">
                Authorised Signatory / CMD
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Overlay for Studio Mode */}
      {interactive && (
        <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs max-w-sm w-full flex items-center justify-between text-xs print:hidden">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Studio Element Tuning:</span>
          </div>
          {selectedElement ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleMove(selectedElement, -1, 0)}
                className="p-1 bg-slate-100 hover:bg-slate-200 rounded font-mono text-xs font-bold"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => handleMove(selectedElement, 1, 0)}
                className="p-1 bg-slate-100 hover:bg-slate-200 rounded font-mono text-xs font-bold"
              >
                →
              </button>
              <button
                type="button"
                onClick={() => handleMove(selectedElement, 0, -1)}
                className="p-1 bg-slate-100 hover:bg-slate-200 rounded font-mono text-xs font-bold"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => handleMove(selectedElement, 0, 1)}
                className="p-1 bg-slate-100 hover:bg-slate-200 rounded font-mono text-xs font-bold"
              >
                ↓
              </button>
              <span className="text-[10px] uppercase font-bold text-emerald-700 ml-1">
                {selectedElement}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400">Click any box to adjust</span>
          )}
        </div>
      )}
    </div>
  );
}
