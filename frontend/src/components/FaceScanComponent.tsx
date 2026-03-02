import React, { useState, useEffect, useCallback } from 'react';
import { useCamera } from '../camera/useCamera';
import { CheckCircle, AlertTriangle, Camera, ScanFace, RefreshCw, ShieldCheck } from 'lucide-react';

type ScanState = 'idle' | 'scanning' | 'success' | 'error';

interface FaceScanComponentProps {
  onScanComplete?: () => void;
}

export default function FaceScanComponent({ onScanComplete }: FaceScanComponentProps) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: 'user', width: 640, height: 480 });

  const requestCamera = useCallback(async () => {
    setPermissionRequested(true);
    await startCamera();
  }, [startCamera]);

  // Auto-start camera on mount to immediately trigger browser permission prompt
  useEffect(() => {
    requestCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (scanState === 'scanning') {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanState('success');
            onScanComplete?.();
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [scanState, onScanComplete]);

  const handleScan = () => {
    if (!isActive || scanState === 'scanning') return;
    setScanState('scanning');
  };

  const handleRetry = async () => {
    setScanState('idle');
    setScanProgress(0);
    setPermissionRequested(true);
    await startCamera();
  };

  if (isSupported === false) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground font-mono">Camera not supported in this browser.</p>
        <p className="text-xs text-muted-foreground font-mono">
          Please use a modern browser (Chrome, Firefox, Safari) with HTTPS.
        </p>
      </div>
    );
  }

  // Show permission request prompt if not yet requested and not loading
  const showPermissionPrompt = !permissionRequested && !isLoading && !isActive && !error;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Permission request banner */}
      {!isActive && !isLoading && !error && permissionRequested && (
        <div
          className="w-full max-w-sm flex items-center gap-3 px-4 py-3 rounded-lg border border-bio-cyan/30 bg-bio-cyan/5"
          style={{ boxShadow: '0 0 12px oklch(0.85 0.18 195 / 0.1)' }}
        >
          <ShieldCheck className="w-5 h-5 text-bio-cyan shrink-0" />
          <p className="text-xs font-mono text-bio-cyan tracking-wide">
            REQUESTING CAMERA ACCESS — Please allow in your browser prompt
          </p>
        </div>
      )}

      {/* Permission denied banner */}
      {!isActive && !isLoading && error && error.type === 'permission' && (
        <div
          className="w-full max-w-sm flex flex-col gap-2 px-4 py-3 rounded-lg border border-destructive/40 bg-destructive/5"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-xs font-mono text-destructive tracking-wide font-semibold">
              CAMERA ACCESS DENIED
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed pl-7">
            Click the camera icon 🎥 in your browser's address bar and select "Allow", then click Retry below.
          </p>
        </div>
      )}

      {/* Camera Frame */}
      <div className="relative">
        {/* Outer decorative ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
            scanState === 'success'
              ? 'border-bio-green'
              : scanState === 'scanning'
                ? 'border-bio-cyan animate-glow-pulse'
                : 'border-bio-cyan/40'
          }`}
          style={{
            width: '320px',
            height: '320px',
            boxShadow:
              scanState === 'success'
                ? '0 0 30px oklch(0.82 0.2 155 / 0.5), 0 0 60px oklch(0.82 0.2 155 / 0.2)'
                : scanState === 'scanning'
                  ? '0 0 30px oklch(0.85 0.18 195 / 0.5), 0 0 60px oklch(0.85 0.18 195 / 0.2)'
                  : '0 0 15px oklch(0.85 0.18 195 / 0.2)',
          }}
        />

        {/* Corner brackets */}
        {(['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'] as const).map((pos, i) => (
          <div
            key={i}
            className={`absolute w-6 h-6 ${pos} ${
              scanState === 'success' ? 'border-bio-green' : 'border-bio-cyan'
            }`}
            style={{
              borderTopWidth: i < 2 ? '2px' : '0',
              borderBottomWidth: i >= 2 ? '2px' : '0',
              borderLeftWidth: i % 2 === 0 ? '2px' : '0',
              borderRightWidth: i % 2 === 1 ? '2px' : '0',
            }}
          />
        ))}

        {/* Video container */}
        <div
          className="overflow-hidden rounded-full bg-bio-surface3 relative"
          style={{ width: '320px', height: '320px' }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scan line overlay */}
          {scanState === 'scanning' && (
            <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
              <div
                className="absolute left-0 right-0 h-0.5 bg-bio-cyan/80 animate-scan-sweep"
                style={{
                  boxShadow: '0 0 8px oklch(0.85 0.18 195 / 0.8), 0 0 16px oklch(0.85 0.18 195 / 0.4)',
                }}
              />
              <div className="absolute inset-0 bg-bio-cyan/5" />
            </div>
          )}

          {/* Success overlay */}
          {scanState === 'success' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bio-green/10 rounded-full">
              <CheckCircle
                className="w-20 h-20 text-bio-green"
                style={{ filter: 'drop-shadow(0 0 12px oklch(0.82 0.2 155 / 0.8))' }}
              />
            </div>
          )}

          {/* Loading / initializing overlay */}
          {isLoading && scanState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bio-surface3/80 rounded-full">
              <div className="flex flex-col items-center gap-3">
                <Camera className="w-10 h-10 text-bio-cyan/60 animate-pulse" />
                <span className="text-xs text-muted-foreground font-mono tracking-wider text-center px-4">
                  REQUESTING CAMERA ACCESS...
                </span>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {!isLoading && !isActive && error && scanState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bio-surface3/90 rounded-full">
              <div className="flex flex-col items-center gap-2 px-6 text-center">
                <AlertTriangle className="w-10 h-10 text-destructive" />
                <span className="text-xs text-destructive font-mono tracking-wider">
                  {error.type === 'permission'
                    ? 'CAMERA ACCESS DENIED'
                    : error.type === 'not-found'
                      ? 'NO CAMERA FOUND'
                      : 'CAMERA ERROR'}
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {error.type === 'permission'
                    ? 'Allow camera access in your browser to continue.'
                    : error.message}
                </span>
              </div>
            </div>
          )}

          {/* Waiting for camera (not loading, not active, no error yet) */}
          {!isLoading && !isActive && !error && scanState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bio-surface3/80 rounded-full">
              <div className="flex flex-col items-center gap-3">
                {showPermissionPrompt ? (
                  <>
                    <Camera className="w-10 h-10 text-bio-cyan animate-pulse" />
                    <span className="text-xs text-bio-cyan font-mono tracking-wider text-center px-4">
                      TAP TO ALLOW CAMERA
                    </span>
                  </>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-bio-cyan/40" />
                    <span className="text-xs text-muted-foreground font-mono tracking-wider text-center px-4">
                      AWAITING CAMERA...
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rotating outer ring when scanning */}
        {scanState === 'scanning' && (
          <div
            className="absolute inset-0 rounded-full border border-bio-cyan/30 animate-spin-slow pointer-events-none"
            style={{
              width: '320px',
              height: '320px',
              borderStyle: 'dashed',
            }}
          />
        )}
      </div>

      {/* Progress bar */}
      {scanState === 'scanning' && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
            <span>ANALYZING BIOMETRICS</span>
            <span>{scanProgress}%</span>
          </div>
          <div className="h-1.5 bg-bio-surface3 rounded-full overflow-hidden">
            <div
              className="h-full bg-bio-cyan rounded-full transition-all duration-100"
              style={{
                width: `${scanProgress}%`,
                boxShadow: '0 0 8px oklch(0.85 0.18 195 / 0.8)',
              }}
            />
          </div>
        </div>
      )}

      {/* Status text */}
      <div className="text-center">
        {scanState === 'idle' && (
          <p className="text-muted-foreground font-mono text-sm tracking-wider">
            {isLoading
              ? 'REQUESTING CAMERA PERMISSION...'
              : isActive
                ? 'POSITION YOUR FACE IN THE FRAME'
                : error
                  ? error.type === 'permission'
                    ? 'ALLOW CAMERA ACCESS IN YOUR BROWSER TO CONTINUE'
                    : 'CAMERA UNAVAILABLE'
                  : 'STARTING CAMERA...'}
          </p>
        )}
        {scanState === 'scanning' && (
          <p className="text-bio-cyan font-mono text-sm tracking-wider animate-pulse">
            SCANNING... DO NOT MOVE
          </p>
        )}
        {scanState === 'success' && (
          <div className="flex flex-col items-center gap-1">
            <p
              className="text-bio-green font-orbitron text-lg font-bold tracking-widest"
              style={{ textShadow: '0 0 12px oklch(0.82 0.2 155 / 0.8)' }}
            >
              IDENTITY VERIFIED
            </p>
            <p className="text-muted-foreground font-mono text-xs tracking-wider">
              BIOMETRIC SIGNATURE CONFIRMED
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {scanState === 'idle' && !isActive && !isLoading && showPermissionPrompt && (
          <button
            onClick={requestCamera}
            className="flex items-center gap-2 px-8 py-3 rounded font-mono font-semibold tracking-widest text-sm
              border-2 border-bio-cyan text-bio-surface1 bg-bio-cyan
              hover:bg-bio-cyan/90 transition-all duration-200 animate-pulse"
            style={{ boxShadow: '0 0 20px oklch(0.85 0.18 195 / 0.4)' }}
          >
            <Camera className="w-5 h-5" />
            ALLOW CAMERA ACCESS
          </button>
        )}

        {scanState === 'idle' && isActive && (
          <button
            onClick={handleScan}
            disabled={!isActive || isLoading}
            className="flex items-center gap-2 px-8 py-3 rounded font-mono font-semibold tracking-widest text-sm
              border-2 border-bio-cyan text-bio-surface1 bg-bio-cyan
              hover:bg-bio-cyan/90 disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200"
            style={{ boxShadow: '0 0 20px oklch(0.85 0.18 195 / 0.4)' }}
          >
            <ScanFace className="w-5 h-5" />
            SCAN FACE
          </button>
        )}

        {scanState === 'idle' && isLoading && (
          <button
            disabled
            className="flex items-center gap-2 px-8 py-3 rounded font-mono font-semibold tracking-widest text-sm
              border-2 border-bio-cyan/40 text-bio-cyan/60 bg-bio-surface3
              disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Camera className="w-5 h-5 animate-pulse" />
            INITIALIZING...
          </button>
        )}

        {scanState === 'idle' && error && (
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 rounded font-mono text-sm tracking-wider
              border border-bio-cyan/40 text-bio-cyan hover:border-bio-cyan/70
              bg-bio-surface3 hover:bg-bio-surface4 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            RETRY
          </button>
        )}
      </div>
    </div>
  );
}
