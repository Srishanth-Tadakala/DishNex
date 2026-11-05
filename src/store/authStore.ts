// ==============================================================================
// DISHNEX AUTHENTICATION STORE (Zustand + AsyncStorage Persistence)
// Handles Supabase session, user profile, and role-protected staff mode
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserRole } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  hasCompletedOnboarding: boolean;

  // Actions
  signIn: (email: string, role?: UserRole) => Promise<boolean>;
  signUp: (email: string, fullName: string) => Promise<boolean>;
  signOut: () => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setUserRole: (role: UserRole) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'user-siddu-01',
  email: 'siddu@dishnex.luxury',
  fullName: 'Siddu',
  phoneNumber: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  role: 'customer',
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: true, // Default active session for instant verification
      isLoading: false,
      user: DEFAULT_USER,
      hasCompletedOnboarding: true,

      signIn: async (email, role = 'customer') => {
        set({ isLoading: true });
        // Simulate auth network handshake
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({
          isAuthenticated: true,
          isLoading: false,
          user: {
            ...DEFAULT_USER,
            email,
            role,
          },
        });
        return true;
      },

      signUp: async (email, fullName) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({
          isAuthenticated: true,
          isLoading: false,
          user: {
            ...DEFAULT_USER,
            email,
            fullName,
            role: 'customer',
          },
        });
        return true;
      },

      signOut: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },

      setOnboardingCompleted: (completed) => {
        set({ hasCompletedOnboarding: completed });
      },

      setUserRole: (role) => {
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        }));
      },
    }),
    {
      name: 'ember-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
