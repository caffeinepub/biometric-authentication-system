import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, LoginEvent } from '../backend';
import { Principal } from '@dfinity/principal';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Login History ────────────────────────────────────────────────────────────

export function useGetLoginHistory(principal: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LoginEvent[]>({
    queryKey: ['loginHistory', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getLoginHistory(principal);
    },
    enabled: !!actor && !actorFetching && !!principal,
  });
}

// ─── Record Login Event ───────────────────────────────────────────────────────

export function useRecordLoginEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (method: string) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const principal = identity.getPrincipal();
      return actor.recordLoginEvent(principal, method);
    },
    onSuccess: (_, __, ___) => {
      if (identity) {
        queryClient.invalidateQueries({
          queryKey: ['loginHistory', identity.getPrincipal().toString()],
        });
      }
    },
  });
}

// ─── Register User ────────────────────────────────────────────────────────────

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
