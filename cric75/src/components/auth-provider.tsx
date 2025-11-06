'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentReference,
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import type { UserProfile } from '@/types';

const defaultUserProfile = (user: User): UserProfile => ({
  uid: user.uid,
  email: user.email ?? '',
  displayName: user.displayName || user.email?.split('@')[0] || 'Scorer',
  photoURL: user.photoURL || undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

async function ensureUserProfile(ref: DocumentReference, data: User): Promise<UserProfile> {
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    const profile = defaultUserProfile(data);
    await setDoc(ref, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return profile;
  }

  const profile = snapshot.data() as UserProfile;

  if (!profile.displayName && data.displayName) {
    await updateDoc(ref, {
      displayName: data.displayName,
      updatedAt: serverTimestamp(),
    });
    return {
      ...profile,
      displayName: data.displayName,
      updatedAt: new Date().toISOString(),
    };
  }

  return profile;
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { actions, loading, hydrated } = useAuthStore((state) => ({
    actions: state.actions,
    loading: state.loading,
    hydrated: state.hydrated,
  }));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        actions.reset();
        return;
      }

      actions.setLoading(true);
      actions.setUser(firebaseUser);
      actions.setHydrated(true);

      try {
        const ref = doc(db, 'users', firebaseUser.uid);
        const profile = await ensureUserProfile(ref, firebaseUser);
        actions.setProfile(profile);
        actions.setError(undefined);
      } catch (error) {
        actions.setError(error instanceof Error ? error.message : 'Failed to load profile');
      } finally {
        actions.setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [actions]);

  if (!hydrated || loading) {
    return (
      <div className={cn('flex min-h-screen items-center justify-center bg-background')}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/20 border-l-brand" />
          <p className="text-sm text-foreground/70">Loading Cric75 dashboard…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
