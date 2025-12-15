import { supabase } from '../api/supabase';

import AsyncStorage from '@react-native-async-storage/async-storage';

const RATE_LIMIT_KEY = 'auth_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const authService = {
  // Rate Limiting Helpers
  async checkRateLimit(): Promise<boolean> {
    try {
      const stored = await AsyncStorage.getItem(RATE_LIMIT_KEY);
      if (!stored) return true;

      const { attempts, firstAttempt } = JSON.parse(stored);
      const now = Date.now();

      // If lockout duration passed, reset
      if (now - firstAttempt > LOCKOUT_DURATION) {
        await AsyncStorage.removeItem(RATE_LIMIT_KEY);
        return true;
      }

      // Check if max attempts reached
      return attempts < MAX_ATTEMPTS;
    } catch {
      return true; // Default allow on error
    }
  },

  async recordFailedAttempt() {
      try {
          const stored = await AsyncStorage.getItem(RATE_LIMIT_KEY);
          const now = Date.now();
          
          if (!stored) {
              await AsyncStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts: 1, firstAttempt: now }));
              return;
          }

          const { attempts, firstAttempt } = JSON.parse(stored);
          
          // If previous window expired, start new
          if (now - firstAttempt > LOCKOUT_DURATION) {
              await AsyncStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts: 1, firstAttempt: now }));
          } else {
              await AsyncStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts: attempts + 1, firstAttempt }));
          }
      } catch (e) {
          console.error('Error recording auth attempt', e);
      }
  },

  async resetRateLimit() {
      try {
          await AsyncStorage.removeItem(RATE_LIMIT_KEY);
      } catch (e) {}
  },

  async signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) throw error;
    
    // Create user profile in 'users' table if needed, though usually handled by trigger
    // But for this simple app, we might rely on auth metadata or a public users table
    // Let's assume there's a trigger or we create it here:
    // We no longer manually insert into 'users' here.
    // This is handled by a Postgres Trigger (handle_new_user) on the server side
    // to avoid RLS permission issues when the user is not yet verified/logged in.

    return data;
  },

  async signIn(email: string, password: string) {
    // 1. Check Rate Limit
    const allowed = await this.checkRateLimit();
    if (!allowed) {
        throw new Error('Too many failed attempts. Please try again in 15 minutes.');
    }

    // 2. Attempt Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 3. Handle Result
    if (error) {
        await this.recordFailedAttempt();
        throw error;
    }

    // 4. Reset on success
    await this.resetRateLimit();
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Fetch profile data
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
        console.error('Error fetching user profile', error);
        return null;
    }

    return profile;
  },

  async updateProfile(userId: string, updates: { display_name?: string; avatar_url?: string }) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    
    // Also update auth metadata if display_name changed
    if (updates.display_name) {
        await supabase.auth.updateUser({
            data: { display_name: updates.display_name }
        });
    }
    
    return data;
  },
};
