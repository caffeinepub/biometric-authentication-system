import React from 'react';
import type { LoginEvent } from '../backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Fingerprint, ScanFace, Key, Shield } from 'lucide-react';

interface LoginHistoryTableProps {
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
    second: '2-digit',
  });
}

function getMethodIcon(method: string) {
  const m = method.toLowerCase();
  if (m.includes('face') || m.includes('scan')) return <ScanFace className="w-4 h-4" />;
  if (m.includes('finger') || m.includes('print')) return <Fingerprint className="w-4 h-4" />;
  if (m.includes('passkey') || m.includes('key')) return <Key className="w-4 h-4" />;
  return <Shield className="w-4 h-4" />;
}

function getMethodColor(method: string): string {
  const m = method.toLowerCase();
  if (m.includes('face') || m.includes('scan')) return 'text-bio-cyan';
  if (m.includes('finger') || m.includes('print')) return 'text-bio-green';
  if (m.includes('passkey') || m.includes('key')) return 'text-bio-cyan';
  return 'text-muted-foreground';
}

export default function LoginHistoryTable({ loginHistory, isLoading }: LoginHistoryTableProps) {
  const sorted = [...loginHistory].sort((a, b) =>
    Number(b.timestamp - a.timestamp)
  );

  return (
    <div
      className="bg-bio-surface2 rounded-lg border border-bio-cyan/20 overflow-hidden"
      style={{ boxShadow: '0 0 20px oklch(0.85 0.18 195 / 0.05)' }}
    >
      <div className="px-5 py-4 border-b border-bio-cyan/10 flex items-center justify-between">
        <div>
          <h3 className="font-orbitron text-sm font-bold text-bio-cyan tracking-widest">
            LOGIN HISTORY
          </h3>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {isLoading ? 'Loading...' : `${loginHistory.length} authentication event${loginHistory.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-bio-green animate-pulse"
            style={{ boxShadow: '0 0 6px oklch(0.82 0.2 155)' }} />
          <span className="text-xs font-mono text-bio-green tracking-wider">LIVE</span>
        </div>
      </div>

      <ScrollArea className="h-72">
        <Table>
          <TableHeader>
            <TableRow className="border-bio-cyan/10 hover:bg-transparent">
              <TableHead className="font-mono text-xs tracking-widest text-muted-foreground uppercase w-12">
                #
              </TableHead>
              <TableHead className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                TIMESTAMP
              </TableHead>
              <TableHead className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                AUTH METHOD
              </TableHead>
              <TableHead className="font-mono text-xs tracking-widest text-muted-foreground uppercase text-right">
                STATUS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-bio-cyan/5">
                  <TableCell><Skeleton className="h-4 w-6 bg-bio-surface3" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40 bg-bio-surface3" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 bg-bio-surface3" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 bg-bio-surface3 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Shield className="w-8 h-8 opacity-30" />
                    <p className="font-mono text-sm tracking-wider">NO LOGIN EVENTS RECORDED</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((event, idx) => (
                <TableRow
                  key={idx}
                  className="border-bio-cyan/5 hover:bg-bio-surface3/50 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {sorted.length - idx}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground/80">
                    {formatTimestamp(event.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 font-mono text-xs ${getMethodColor(event.method)}`}>
                      {getMethodIcon(event.method)}
                      <span className="tracking-wider uppercase">{event.method}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono
                        bg-bio-green/10 text-bio-green border border-bio-green/20 tracking-wider"
                    >
                      SUCCESS
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
