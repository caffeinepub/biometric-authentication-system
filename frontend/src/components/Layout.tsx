import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginButton from './LoginButton';
import { Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export default function Layout({ children, showHeader = true }: LayoutProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background circuit-bg flex flex-col">
      {showHeader && (
        <header className="border-b border-bio-cyan/20 bg-bio-surface2/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Shield
                    className="w-8 h-8 text-bio-cyan"
                    style={{ filter: 'drop-shadow(0 0 8px oklch(0.85 0.18 195 / 0.7))' }}
                  />
                </div>
                <div>
                  <span className="font-orbitron text-sm font-bold text-bio-cyan tracking-widest uppercase">
                    BioAuth
                  </span>
                  <div className="text-xs text-muted-foreground tracking-wider">
                    SECURE SYSTEM v2.0
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div
                    className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-bio-green animate-pulse' : 'bg-bio-cyan/40'}`}
                    style={isAuthenticated ? { boxShadow: '0 0 6px oklch(0.82 0.2 155)' } : {}}
                  />
                  <span className="font-mono tracking-wider">
                    {isAuthenticated ? 'AUTHENTICATED' : 'UNAUTHENTICATED'}
                  </span>
                </div>
              </div>

              {/* Login button */}
              <LoginButton />
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-bio-cyan/10 bg-bio-surface2/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-bio-cyan/60" />
              <span className="tracking-wider">
                © {new Date().getFullYear()} BIOMETRIC AUTH SYSTEM — ALL RIGHTS RESERVED
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>Built with</span>
              <span className="text-bio-cyan" style={{ filter: 'drop-shadow(0 0 4px oklch(0.85 0.18 195 / 0.8))' }}>♥</span>
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'biometric-auth-system')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bio-cyan hover:text-bio-cyan/80 transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
