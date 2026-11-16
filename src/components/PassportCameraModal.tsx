'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Check, X, Sliders, Upload, Sparkles, AlertCircle } from 'lucide-react';

interface PassportCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Photo: string) => void;
}

export default function PassportCameraModal({
  isOpen,
  onClose,
  onCapture,
}: PassportCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [applyWhiteBg, setApplyWhiteBg] = useState(true);
  const [bgThreshold, setBgThreshold] = useState<number>(35);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Start webcam
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user',
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please allow webcam permissions or upload an image.');
      setCameraActive(false);
    }
  }, []);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage, startCamera, stopCamera]);

  // Process image with background whitening
  const processWhiteBackground = useCallback(
    (rawImgDataUrl: string, threshold: number): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 500;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawImgDataUrl);
            return;
          }

          // Draw cropped portrait (center-cropped to 4:5 passport aspect ratio)
          const srcRatio = img.width / img.height;
          const targetRatio = 400 / 500;
          let sx = 0,
            sy = 0,
            sWidth = img.width,
            sHeight = img.height;

          if (srcRatio > targetRatio) {
            sWidth = img.height * targetRatio;
            sx = (img.width - sWidth) / 2;
          } else {
            sHeight = img.width / targetRatio;
            sy = (img.height - sHeight) / 2;
          }

          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 400, 500);

          if (!applyWhiteBg) {
            resolve(canvas.toDataURL('image/jpeg', 0.95));
            return;
          }

          const imgData = ctx.getImageData(0, 0, 400, 500);
          const data = imgData.data;

          // Sample background color from outer border perimeter
          let sampleR = 0,
            sampleG = 0,
            sampleB = 0;
          let sampleCount = 0;

          // Top perimeter & corners
          for (let x = 0; x < 400; x += 10) {
            for (let y = 0; y < 40; y += 10) {
              const idx = (y * 400 + x) * 4;
              sampleR += data[idx];
              sampleG += data[idx + 1];
              sampleB += data[idx + 2];
              sampleCount++;
            }
          }
          const avgR = sampleR / sampleCount;
          const avgG = sampleG / sampleCount;
          const avgB = sampleB / sampleCount;

          // Replace pixels matching background color or high luminance with pure studio white
          const th = threshold * 2.8;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const diff =
              Math.sqrt(
                Math.pow(r - avgR, 2) + Math.pow(g - avgG, 2) + Math.pow(b - avgB, 2)
              ) / Math.sqrt(3);

            // If close to sampled background, or already near white/gray, whiten it
            if (diff < th || (r > 200 && g > 200 && b > 200)) {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
            }
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.src = rawImgDataUrl;
      });
    },
    [applyWhiteBg]
  );

  // Capture from live video
  const handleCapture = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw flipped horizontal for natural mirror view
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const raw = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(raw);
    stopCamera();

    setIsProcessing(true);
    const processed = await processWhiteBackground(raw, bgThreshold);
    setProcessedImage(processed);
    setIsProcessing(false);
  };

  // Retake
  const handleRetake = () => {
    setCapturedImage(null);
    setProcessedImage(null);
    startCamera();
  };

  // Re-process when threshold or toggle changes
  useEffect(() => {
    if (capturedImage) {
      setIsProcessing(true);
      processWhiteBackground(capturedImage, bgThreshold).then((res) => {
        setProcessedImage(res);
        setIsProcessing(false);
      });
    }
  }, [capturedImage, bgThreshold, applyWhiteBg, processWhiteBackground]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const raw = reader.result as string;
      setCapturedImage(raw);
      stopCamera();
      setIsProcessing(true);
      const processed = await processWhiteBackground(raw, bgThreshold);
      setProcessedImage(processed);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (processedImage) {
      onCapture(processedImage);
      onClose();
    } else if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Passport Photo Studio</h3>
              <p className="text-xs text-slate-500">Live webcam capture with white background processing</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative bg-slate-950 flex items-center justify-center min-h-[380px] overflow-hidden">
          {!capturedImage ? (
            <>
              {cameraError ? (
                <div className="p-6 text-center text-slate-300 max-w-xs">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                  <p className="text-xs mb-4">{cameraError}</p>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full max-h-[400px] object-cover -scale-x-100"
                  />
                  {/* Passport Oval Guide Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-52 h-64 border-2 border-emerald-400/70 border-dashed rounded-[50%/60%] shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] flex flex-col items-center justify-between p-3">
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded-full">
                        Position Face Here
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded-full">
                        Shoulders Level
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="relative flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={processedImage || capturedImage}
                alt="Captured Portrait"
                className="w-64 h-80 object-cover rounded-xl shadow-lg border-2 border-white bg-white"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Whitening background...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Processing Controls (Visible after capture) */}
        {capturedImage && (
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={applyWhiteBg}
                  onChange={(e) => setApplyWhiteBg(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Auto-White Background Removal</span>
              </label>

              <span className="text-[11px] font-mono text-slate-500">
                Sensitivity: {bgThreshold}%
              </span>
            </div>

            {applyWhiteBg && (
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={bgThreshold}
                  onChange={(e) => setBgThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
          {!capturedImage ? (
            <>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleCapture}
                disabled={!cameraActive}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 disabled:opacity-50 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Take Passport Photo</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>Retake</span>
              </button>

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
                  onClick={handleConfirm}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Photo</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
