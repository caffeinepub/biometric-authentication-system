import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import FaceScanComponent from '../components/FaceScanComponent';
import StepIndicator from '../components/StepIndicator';
import { ScanFace, Fingerprint, LayoutDashboard, ArrowRight } from 'lucide-react';

const STEPS = [
  { number: 1, label: 'FACE SCAN', sublabel: 'Biometric capture', icon: <ScanFace className="w-5 h-5" /> },
  { number: 2, label: 'PASSKEY LOGIN', sublabel: 'Cryptographic auth', icon: <Fingerprint className="w-5 h-5" /> },
  { number: 3, label: 'DASHBOARD', sublabel: 'Secure access', icon: <LayoutDashboard className="w-5 h-5" /> },
];

export default function BiometricScanPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [scanComplete, setScanComplete] = useState(false);

  const handleScanComplete = () => {
    setScanComplete(true);
  };

  const handleContinue = () => {
    if (identity) {
      navigate({ to: '/dashboard' });
    } else {
      // Prompt login — navigate to dashboard which will handle auth redirect
      navigate({ to: '/dashboard' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-bio-cyan/30 bg-bio-cyan/5 text-bio-cyan text-xs font-mono tracking-widest mb-4">
            <div
              className="w-1.5 h-1.5 rounded-full bg-bio-cyan animate-pulse"
              style={{ boxShadow: '0 0 6px oklch(0.85 0.18 195)' }}
            />
            BIOMETRIC VERIFICATION
          </div>
          <h1
            className="font-orbitron text-2xl sm:text-3xl font-bold text-bio-cyan tracking-wider"
            style={{ textShadow: '0 0 20px oklch(0.85 0.18 195 / 0.4)' }}
          >
            FACE RECOGNITION
          </h1>
          <p className="text-muted-foreground font-mono text-sm tracking-wide">
            Position your face within the frame and initiate scan
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator
          steps={STEPS}
          currentStep={1}
          completedSteps={scanComplete ? [1] : []}
          orientation="horizontal"
          size="sm"
        />

        {/* Face scan component */}
        <div
          className="bg-bio-surface2 rounded-xl border border-bio-cyan/20 p-8 flex flex-col items-center"
          style={{ boxShadow: '0 0 40px oklch(0.85 0.18 195 / 0.08)' }}
        >
          <FaceScanComponent onScanComplete={handleScanComplete} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {/* Empty left side — no back button needed since this is the entry point */}
          <div />

          {scanComplete && (
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-8 py-3 rounded font-orbitron font-bold
                tracking-widest text-sm border-2 border-bio-green text-bio-surface1 bg-bio-green
                hover:bg-bio-green/90 transition-all duration-200 animate-fade-in-up"
              style={{ boxShadow: '0 0 20px oklch(0.82 0.2 155 / 0.4)' }}
            >
              {identity ? 'GO TO DASHBOARD' : 'CONTINUE TO LOGIN'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Info note */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-mono tracking-wider">
            ⚡ DEMO MODE — Face scan is a visual demonstration. Real authentication uses cryptographic passkeys.
          </p>
        </div>
      </div>
    </div>
  );
}
