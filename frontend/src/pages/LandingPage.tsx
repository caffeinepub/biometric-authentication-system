import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import StepIndicator from '../components/StepIndicator';
import { ScanFace, Fingerprint, LayoutDashboard, ArrowRight, Shield, Zap, Lock } from 'lucide-react';

const DEMO_STEPS = [
  {
    number: 1,
    label: 'FACE SCAN',
    sublabel: 'Biometric capture',
    icon: <ScanFace className="w-6 h-6" />,
  },
  {
    number: 2,
    label: 'PASSKEY LOGIN',
    sublabel: 'Cryptographic auth',
    icon: <Fingerprint className="w-6 h-6" />,
  },
  {
    number: 3,
    label: 'DASHBOARD',
    sublabel: 'Secure access',
    icon: <LayoutDashboard className="w-6 h-6" />,
  },
];

const FEATURES = [
  {
    icon: <Shield className="w-6 h-6 text-bio-cyan" />,
    title: 'Zero Password',
    desc: 'No passwords to steal. Biometric + cryptographic passkeys only.',
  },
  {
    icon: <Zap className="w-6 h-6 text-bio-green" />,
    title: 'Instant Auth',
    desc: 'Sub-second authentication using device biometrics.',
  },
  {
    icon: <Lock className="w-6 h-6 text-bio-cyan" />,
    title: 'Tamper-Proof',
    desc: 'Identity data stored on-chain. Immutable and verifiable.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const handleStartDemo = () => {
    if (identity) {
      navigate({ to: '/dashboard' });
    } else {
      navigate({ to: '/biometric-scan' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        {/* Hero banner background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/hero-banner.dim_1200x400.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
            style={{
              background: 'radial-gradient(circle, oklch(0.85 0.18 195) 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5"
            style={{
              background: 'radial-gradient(circle, oklch(0.82 0.2 155) 0%, transparent 70%)',
              animation: 'pulse 6s ease-in-out infinite 2s',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-bio-cyan/30 bg-bio-cyan/5 text-bio-cyan text-xs font-mono tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-bio-cyan animate-pulse"
              style={{ boxShadow: '0 0 6px oklch(0.85 0.18 195)' }} />
            LIVE DEMONSTRATION SYSTEM
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1
              className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black tracking-wider text-foreground"
              style={{ textShadow: '0 0 40px oklch(0.85 0.18 195 / 0.3)' }}
            >
              BIOMETRIC
              <br />
              <span
                className="text-bio-cyan"
                style={{ textShadow: '0 0 30px oklch(0.85 0.18 195 / 0.6)' }}
              >
                AUTH SYSTEM
              </span>
            </h1>
            <p className="text-muted-foreground font-mono text-base sm:text-lg max-w-2xl mx-auto leading-relaxed tracking-wide">
              Next-generation passwordless authentication using facial biometrics and
              cryptographic passkeys. Identity theft prevention through advanced biometric verification.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartDemo}
              className="group flex items-center gap-3 px-10 py-4 rounded font-orbitron font-bold
                tracking-widest text-base border-2 border-bio-cyan text-bio-surface1 bg-bio-cyan
                hover:bg-bio-cyan/90 transition-all duration-300"
              style={{ boxShadow: '0 0 30px oklch(0.85 0.18 195 / 0.4), 0 0 60px oklch(0.85 0.18 195 / 0.15)' }}
            >
              <ScanFace className="w-5 h-5" />
              START DEMO
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 border-t border-bio-cyan/10 bg-bio-surface2/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-xl font-bold text-bio-cyan tracking-widest mb-2">
              AUTHENTICATION FLOW
            </h2>
            <p className="text-muted-foreground font-mono text-sm tracking-wider">
              Three-step biometric verification process
            </p>
          </div>

          <StepIndicator
            steps={DEMO_STEPS}
            currentStep={1}
            completedSteps={[]}
            orientation="horizontal"
            size="lg"
          />

          {/* Step descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {[
              {
                step: '01',
                title: 'Face Scan',
                desc: 'Live webcam capture with biometric frame analysis and identity verification.',
                color: 'cyan',
                img: '/assets/generated/face-scan-icon.dim_256x256.png',
              },
              {
                step: '02',
                title: 'Passkey Login',
                desc: 'Cryptographic passkey authentication using device biometrics (fingerprint/Face ID).',
                color: 'green',
                img: '/assets/generated/fingerprint-icon.dim_256x256.png',
              },
              {
                step: '03',
                title: 'Secure Dashboard',
                desc: 'Access your personal security dashboard with full login history and analytics.',
                color: 'cyan',
                img: null,
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`bg-bio-surface2 rounded-lg p-6 border transition-all duration-300
                  ${item.color === 'cyan' ? 'border-bio-cyan/20 hover:border-bio-cyan/40' : 'border-bio-green/20 hover:border-bio-green/40'}`}
              >
                <div className="flex items-start gap-4">
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-12 h-12 object-contain opacity-80"
                    />
                  )}
                  {!item.img && (
                    <div className={`w-12 h-12 rounded flex items-center justify-center
                      ${item.color === 'cyan' ? 'bg-bio-cyan/10' : 'bg-bio-green/10'}`}>
                      <LayoutDashboard className={`w-6 h-6 ${item.color === 'cyan' ? 'text-bio-cyan' : 'text-bio-green'}`} />
                    </div>
                  )}
                  <div>
                    <div className={`font-orbitron text-xs font-bold tracking-widest mb-1
                      ${item.color === 'cyan' ? 'text-bio-cyan/60' : 'text-bio-green/60'}`}>
                      STEP {item.step}
                    </div>
                    <h3 className="font-mono font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-xs font-mono leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 border-t border-bio-cyan/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 p-4">
                <div className="p-2 rounded bg-bio-surface3 flex-shrink-0">{feature.icon}</div>
                <div>
                  <h4 className="font-mono font-semibold text-sm text-foreground mb-1">{feature.title}</h4>
                  <p className="text-muted-foreground text-xs font-mono leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
