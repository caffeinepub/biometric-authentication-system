import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Fingerprint, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (isAuthenticated) {
    return (
      <button
        onClick={handleAuth}
        className="flex items-center gap-2 px-4 py-2 rounded text-sm font-mono tracking-wider
          border border-bio-cyan/30 text-bio-cyan/70 hover:text-bio-cyan hover:border-bio-cyan/60
          bg-bio-surface3/50 hover:bg-bio-surface3 transition-all duration-200"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">LOGOUT</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleAuth}
      disabled={isLoggingIn}
      className="flex items-center gap-2 px-5 py-2 rounded text-sm font-mono font-semibold tracking-wider
        border border-bio-cyan/60 text-bio-surface1 bg-bio-cyan
        hover:bg-bio-cyan/90 hover:shadow-glow-cyan-sm
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200"
      style={{ boxShadow: isLoggingIn ? undefined : '0 0 12px oklch(0.85 0.18 195 / 0.3)' }}
    >
      {isLoggingIn ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Fingerprint className="w-4 h-4" />
      )}
      <span>{isLoggingIn ? 'AUTHENTICATING...' : 'LOGIN'}</span>
    </button>
  );
}
