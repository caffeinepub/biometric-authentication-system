import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetLoginHistory, useRecordLoginEvent } from '../hooks/useQueries';
import DashboardSummaryCards from '../components/DashboardSummaryCards';
import LoginHistoryTable from '../components/LoginHistoryTable';
import { Principal } from '@dfinity/principal';
import { Shield, User, RefreshCw, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { mutate: recordLogin } = useRecordLoginEvent();

  const principal = identity ? identity.getPrincipal() : null;
  const principalObj = principal ? Principal.fromText(principal.toString()) : null;

  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: loginHistory = [], isLoading: historyLoading, refetch } = useGetLoginHistory(principalObj);

  // Record login event on first dashboard load
  useEffect(() => {
    if (identity && userProfile) {
      recordLogin('Internet Identity Passkey');
    }
  }, [userProfile]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  if (!identity) {
    navigate({ to: '/' });
    return null;
  }

  const principalStr = principal?.toString() ?? '';
  const shortPrincipal = principalStr.length > 20
    ? `${principalStr.slice(0, 10)}...${principalStr.slice(-6)}`
    : principalStr;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full bg-bio-green animate-pulse"
                style={{ boxShadow: '0 0 6px oklch(0.82 0.2 155)' }}
              />
              <span className="text-xs font-mono tracking-widest text-bio-green">SECURE SESSION ACTIVE</span>
            </div>
            <h1
              className="font-orbitron text-2xl sm:text-3xl font-bold text-bio-cyan tracking-wider"
              style={{ textShadow: '0 0 20px oklch(0.85 0.18 195 / 0.4)' }}
            >
              SECURITY DASHBOARD
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              Identity verified — full access granted
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-3 py-2 rounded font-mono text-xs tracking-wider
                border border-bio-cyan/20 text-muted-foreground hover:text-bio-cyan hover:border-bio-cyan/40
                bg-bio-surface3 hover:bg-bio-surface4 transition-all duration-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              REFRESH
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded font-mono text-xs tracking-wider
                border border-destructive/40 text-destructive hover:border-destructive/70
                bg-destructive/5 hover:bg-destructive/10 transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              LOGOUT
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div
          className="bg-bio-surface2 rounded-xl border border-bio-cyan/20 p-6"
          style={{ boxShadow: '0 0 30px oklch(0.85 0.18 195 / 0.06)' }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full bg-bio-cyan/10 border-2 border-bio-cyan/40 flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: '0 0 20px oklch(0.85 0.18 195 / 0.2)' }}
            >
              <User className="w-8 h-8 text-bio-cyan" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-bio-green" />
                <span className="text-xs font-mono tracking-widest text-bio-green">VERIFIED IDENTITY</span>
              </div>
              {profileLoading ? (
                <div className="h-7 w-48 bg-bio-surface3 rounded animate-pulse" />
              ) : (
                <h2 className="font-orbitron text-xl font-bold text-foreground">
                  {userProfile?.displayName ?? 'Unknown User'}
                </h2>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="text-bio-cyan/60">PRINCIPAL:</span>
                  <span className="text-bio-cyan/80 font-mono">{shortPrincipal}</span>
                </span>
                {userProfile?.registrationTimestamp && (
                  <span className="flex items-center gap-1">
                    <span className="text-bio-cyan/60">REGISTERED:</span>
                    <span>
                      {new Date(Number(userProfile.registrationTimestamp / BigInt(1_000_000))).toLocaleDateString()}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Auth badge */}
            <div
              className="px-4 py-2 rounded border border-bio-green/30 bg-bio-green/10 text-bio-green font-mono text-xs tracking-widest"
              style={{ boxShadow: '0 0 12px oklch(0.82 0.2 155 / 0.15)' }}
            >
              ✓ AUTHENTICATED
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <DashboardSummaryCards loginHistory={loginHistory} isLoading={historyLoading} />

        {/* Login History Table */}
        <LoginHistoryTable loginHistory={loginHistory} isLoading={historyLoading} />
      </div>
    </div>
  );
}
