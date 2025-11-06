'use client';

import { useCallback, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

import { auth, db } from '@/lib/firebase';
import { useAuthStore, authSelectors } from '@/store/auth-store';
import type { UserProfile } from '@/types';

export function useAuth() {
  const user = useAuthStore(authSelectors.user);
  const profile = useAuthStore(authSelectors.profile);
  const loading = useAuthStore(authSelectors.loading);
  const error = useAuthStore(authSelectors.error);
  const actions = useAuthStore((state) => state.actions);

  const register = useCallback(
    async (params: { email: string; password: string; displayName: string }) => {
      actions.setLoading(true);

      try {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          params.email,
          params.password,
        );

        await updateFirebaseProfile(credentials.user, {
          displayName: params.displayName,
        });

        const ref = doc(db, 'users', credentials.user.uid);
        const nextProfile: UserProfile = {
          uid: credentials.user.uid,
          email: params.email,
          displayName: params.displayName,
          photoURL: credentials.user.photoURL ?? undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(ref, {
          ...nextProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        actions.setProfile(nextProfile);
        toast.success('Welcome to Cric75! Your profile is ready.');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to register';
        actions.setError(message);
        toast.error(message);
        throw err;
      } finally {
        actions.setLoading(false);
      }
    },
    [actions],
  );

  const login = useCallback(
    async (params: { email: string; password: string }) => {
      actions.setLoading(true);

      try {
        await signInWithEmailAndPassword(auth, params.email, params.password);
        toast.success('Welcome back to Cric75!');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to sign in';
        actions.setError(message);
        toast.error(message);
        throw err;
      } finally {
        actions.setLoading(false);
      }
    },
    [actions],
  );

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      actions.reset();
      toast.success('Signed out from Cric75');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      actions.setError(message);
      toast.error(message);
      throw err;
    }
  }, [actions]);

  const updateProfile = useCallback(
    async (params: Partial<Pick<UserProfile, 'displayName' | 'photoURL' | 'bio'>>) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      actions.setLoading(true);

      try {
        if (params.displayName || params.photoURL) {
          await updateFirebaseProfile(user, {
            displayName: params.displayName ?? user.displayName ?? undefined,
            photoURL: params.photoURL ?? user.photoURL ?? undefined,
          });
        }

        const ref = doc(db, 'users', user.uid);
        await updateDoc(ref, {
          ...params,
          updatedAt: serverTimestamp(),
        });

        actions.setProfile(
          profile
            ? {
                ...profile,
                ...params,
                updatedAt: new Date().toISOString(),
              }
            : null,
        );

        toast.success('Profile updated');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not update profile';
        actions.setError(message);
        toast.error(message);
        throw err;
      } finally {
        actions.setLoading(false);
      }
    },
    [actions, profile, user],
  );

  return useMemo(
    () => ({
      user,
      profile,
      loading,
      error,
      register,
      login,
      logout,
      updateProfile,
    }),
    [user, profile, loading, error, register, login, logout, updateProfile],
  );
}
