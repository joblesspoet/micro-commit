import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../api/supabase';
import { authService } from '../services/auth.service';
import { User } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: typeof authService.signIn;
  signUp: typeof authService.signUp;
  signOut: typeof authService.signOut;
  updateProfile: typeof authService.updateProfile;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await refreshUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await refreshUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshUserProfile = async (userId: string) => {
    try {
      const profile = await authService.getCurrentUser();
      if (profile) {
        setUser(profile as User);
      }
    } catch (e) {
      console.error('Error loading user profile', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      isLoading,
      signIn: authService.signIn,
      signUp: authService.signUp,
      signOut: authService.signOut,
      refreshProfile: async () => {
          if (user?.id) await refreshUserProfile(user.id);
      },
      updateProfile: async (id, updates) => {
        const updated = await authService.updateProfile(id, updates);
        setUser(updated as User);
        return updated;
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
