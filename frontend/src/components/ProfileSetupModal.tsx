import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { UserCheck, Loader2 } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) {
      setError('Display name is required');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    setError('');
    saveProfile(trimmed);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="bg-bio-surface2 border border-bio-cyan/30 text-foreground max-w-md"
        style={{ boxShadow: '0 0 40px oklch(0.85 0.18 195 / 0.2)' }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-full bg-bio-cyan/20 border border-bio-cyan/50 flex items-center justify-center"
              style={{ boxShadow: '0 0 12px oklch(0.85 0.18 195 / 0.3)' }}
            >
              <UserCheck className="w-5 h-5 text-bio-cyan" />
            </div>
            <div>
              <DialogTitle className="font-orbitron text-bio-cyan tracking-wider text-base">
                IDENTITY REGISTRATION
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="font-mono text-sm text-muted-foreground tracking-wide">
            Authentication successful. Register your identity profile to complete setup.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label
              htmlFor="displayName"
              className="font-mono text-xs tracking-widest text-bio-cyan/80 uppercase"
            >
              Display Name
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name..."
              className="bg-bio-surface3 border-bio-cyan/30 text-foreground font-mono
                focus:border-bio-cyan focus:ring-bio-cyan/20 placeholder:text-muted-foreground/50"
              style={{ boxShadow: 'none' }}
              autoFocus
            />
            {error && (
              <p className="text-destructive text-xs font-mono">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || !displayName.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded font-mono font-semibold
              tracking-widest text-sm border-2 border-bio-cyan text-bio-surface1 bg-bio-cyan
              hover:bg-bio-cyan/90 disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200"
            style={{ boxShadow: '0 0 16px oklch(0.85 0.18 195 / 0.3)' }}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                REGISTERING...
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                REGISTER IDENTITY
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
