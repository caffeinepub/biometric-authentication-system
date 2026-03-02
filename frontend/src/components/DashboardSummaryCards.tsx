import React from 'react';
import type { LoginEvent } from '../backend';
import { Activity, Clock, Shield, TrendingUp } from 'lucide-react';

interface DashboardSummaryCardsProps {
  loginHistory: LoginEvent[];
  isLoading?: boolean;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function timeAgo(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const now = Date.now();
  const diff = now - ms;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function DashboardSummaryCards({ loginHistory, isLoading }: DashboardSummaryCardsProps) {
  const totalLogins = loginHistory.length;
  const lastLogin = loginHistory.length > 0
    ? loginHistory.reduce((a, b) => (a.timestamp > b.timestamp ? a : b))
    : null;

  const methodCounts = loginHistory.reduce<Record<string, number>>((acc, ev) => {
    acc[ev.method] = (acc[ev.method] || 0) + 1;
    return acc;
  }, {});
  const topMethod = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const cards = [
    {
      icon: <Activity className="w-6 h-6" />,
      label: 'TOTAL LOGINS',
      value: isLoading ? '—' : String(totalLogins),
      sub: 'authentication events',
      color: 'cyan',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'LAST LOGIN',
      value: isLoading ? '—' : lastLogin ? timeAgo(lastLogin.timestamp) : 'Never',
      sub: lastLogin ? formatTimestamp(lastLogin.timestamp) : '—',
      color: 'green',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      label: 'AUTH METHOD',
      value: isLoading ? '—' : topMethod,
      sub: 'primary method used',
      color: 'cyan',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'SECURITY SCORE',
      value: isLoading ? '—' : totalLogins > 0 ? '98%' : 'N/A',
      sub: 'identity confidence',
      color: 'green',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-bio-surface2 rounded-lg p-5 border transition-all duration-300 hover:scale-[1.02]
            ${card.color === 'cyan' ? 'border-bio-cyan/20 hover:border-bio-cyan/40' : 'border-bio-green/20 hover:border-bio-green/40'}`}
          style={{
            boxShadow:
              card.color === 'cyan'
                ? '0 0 20px oklch(0.85 0.18 195 / 0.05)'
                : '0 0 20px oklch(0.82 0.2 155 / 0.05)',
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`p-2 rounded ${
                card.color === 'cyan' ? 'bg-bio-cyan/10 text-bio-cyan' : 'bg-bio-green/10 text-bio-green'
              }`}
            >
              {card.icon}
            </div>
            <div
              className={`w-2 h-2 rounded-full mt-1 ${
                card.color === 'cyan' ? 'bg-bio-cyan' : 'bg-bio-green'
              }`}
              style={{
                boxShadow:
                  card.color === 'cyan'
                    ? '0 0 6px oklch(0.85 0.18 195)'
                    : '0 0 6px oklch(0.82 0.2 155)',
              }}
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono tracking-widest text-muted-foreground">{card.label}</p>
            <p
              className={`text-2xl font-orbitron font-bold ${
                card.color === 'cyan' ? 'text-bio-cyan' : 'text-bio-green'
              }`}
              style={{
                textShadow:
                  card.color === 'cyan'
                    ? '0 0 12px oklch(0.85 0.18 195 / 0.5)'
                    : '0 0 12px oklch(0.82 0.2 155 / 0.5)',
              }}
            >
              {isLoading ? (
                <span className="inline-block w-16 h-7 bg-bio-surface3 rounded animate-pulse" />
              ) : (
                card.value
              )}
            </p>
            <p className="text-xs text-muted-foreground font-mono truncate">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
