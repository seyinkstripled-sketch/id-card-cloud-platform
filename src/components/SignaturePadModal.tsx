'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, X, Upload } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (base64Signature: string) => void;
}

export default function SignaturePadModal({
  isOpen,
  onClose,
  onSave,
}: SignaturePadModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [penColor, setPenColor] = useState<string>('#FFFFFF'); // White for green footer
  const [penWidth, setPenWidth] = useState<number>(3);

  // Initialize canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 500 * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;

    // Clear background
    ctx.clearRect(0, 0, 500, 200);
    setHasDrawn(false);
  }, [isOpen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
    }
  }, [penColor, penWidth]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, 500, 200);
        ctx.drawImage(img, 50, 20, 400, 160);
        setHasDrawn(true);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Digital Signature Pad</h3>
              <p className="text-xs text-slate-500">Draw or upload official signature for the card footer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area (Green backdrop mimicking official footer) */}
        <div className="p-6 bg-slate-900 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[480px] h-[190px] rounded-2xl bg-[#014e24] border-2 border-emerald-500/40 shadow-inner flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none"
              style={{ width: '100%', height: '100%' }}
            />
            {/* Guide line */}
            <div className="absolute bottom-6 left-12 right-12 border-b border-dashed border-white/40 pointer-events-none" />
            <span className="absolute bottom-2 text-[10px] text-emerald-200/60 uppercase tracking-widest pointer-events-none">
              Sign Above The Line
            </span>
          </div>

          <div className="w-full max-w-[480px] mt-4 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Ink Color:</span>
              <button
                type="button"
                onClick={() => setPenColor('#FFFFFF')}
                className={`w-6 h-6 rounded-full bg-white border-2 ${
                  penColor === '#FFFFFF' ? 'border-emerald-400 scale-110' : 'border-transparent'
                }`}
                title="White Ink (Optimal for green card footer)"
              />
              <button
                type="button"
                onClick={() => setPenColor('#0F172A')}
                className={`w-6 h-6 rounded-full bg-slate-900 border-2 ${
                  penColor === '#0F172A' ? 'border-emerald-400 scale-110' : 'border-slate-600'
                }`}
                title="Dark Ink"
              />
              <button
                type="button"
                onClick={() => setPenColor('#1E40AF')}
                className={`w-6 h-6 rounded-full bg-blue-700 border-2 ${
                  penColor === '#1E40AF' ? 'border-emerald-400 scale-110' : 'border-transparent'
                }`}
                title="Blue Ink"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Stroke:</span>
              <button
                type="button"
                onClick={() => setPenWidth(2)}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  penWidth === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Fine
              </button>
              <button
                type="button"
                onClick={() => setPenWidth(3.5)}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  penWidth === 3.5 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Bold
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Clear</span>
            </button>

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Upload Scan</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasDrawn}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 disabled:opacity-50 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Adopt Signature</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
