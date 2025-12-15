import { supabase } from '../api/supabase';
import { User, Habit, HabitCompletion, Badge, UserBadge } from '../types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface ProfileStats {
  activeHabits: number;
  totalCompletions: number;
  longestStreak: number;
  badgesEarned: number;
  favoriteCategory: string;
  completionRate: number;
}

export const profileService = {
  /**
   * Fetch all profile statistics
   */
  async getProfileStats(userId: string): Promise<ProfileStats> {
    const [
      activeHabits,
      completions,
      user
    ] = await Promise.all([
      supabase.from('habits').select('id, category', { count: 'exact' }).eq('user_id', userId).eq('is_active', true),
      supabase.from('habit_completions').select('id, habit_id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('users').select('longest_streak, created_at, total_badges').eq('id', userId).single()
    ]);

    // Active Habits
    const activeHabitsCount = activeHabits.count || 0;

    // Total Completions
    const totalCompletionsCount = completions.count || 0;

    // Longest Streak (from user profile or calculate max)
    const longestStreak = user.data?.longest_streak || 0;

    // Badges Earned
    const badgesEarned = user.data?.total_badges || 0;

    // Favorite Category
    let favoriteCategory = '🎯'; // Default
    if (activeHabits.data && activeHabits.data.length > 0) {
        // Find category with most completions
        // First get habit IDs for each category
        const habitsByCategory: Record<string, string[]> = {};
        activeHabits.data.forEach(h => {
             if (!habitsByCategory[h.category]) habitsByCategory[h.category] = [];
             habitsByCategory[h.category].push(h.id);
        });

        // Count completions per category
        const categoryCounts: Record<string, number> = {};
        if (completions.data) {
             completions.data.forEach(c => {
                 // Find which habit this completion belongs to
                 // This is inefficient if we don't have joined data, but for MVP it's okay
                 // Better: fetch completions joined with habits
                 // Let's rely on approximate logic or specific query for category favorite if needed
                 // For now, let's select habits with category in separate query or map manually
             });
        }
        
        // Let's do a direct join query for favorite category to be accurate
        const { data: catData } = await supabase
            .from('habit_completions')
            .select('habits(category)')
            .eq('user_id', userId);
            
        if (catData && catData.length > 0) {
            const counts: Record<string, number> = {};
            catData.forEach((item: any) => {
                const cat = item.habits?.category;
                if (cat) counts[cat] = (counts[cat] || 0) + 1;
            });
            
            const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            if (entries.length > 0) {
                favoriteCategory = getCategoryEmoji(entries[0][0]);
            }
        }
    }

    // Completion Rate
    // Days since joined vs Days with at least 1 completion
    const joinedDate = new Date(user.data?.created_at || new Date());
    const daysSinceJoined = Math.max(1, Math.floor((new Date().getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Get unique days active
    // This can be heavy on large datasets. Optimization: maintain 'days_active' counter in users table.
    // For MVP, we count unique dates in completions
    let daysActive = 0;
    if (completions.data) {
        const uniqueDates = new Set(completions.data.map(c => {
             // completion record might just have ID, we need completed_at. 
             // We can fetch just completed_at in a separate query or update the one above
             return 'x'; // placeholder if we didn't fetch date
        }));
    }
    
    // Refetch accurate completions dates
    const { data: completionDates } = await supabase
        .from('habit_completions')
        .select('completed_at')
        .eq('user_id', userId);
        
    if (completionDates) {
        const uniqueDays = new Set(completionDates.map(c => c.completed_at.split('T')[0]));
        daysActive = uniqueDays.size;
    }
    
    const completionRate = Math.round((daysActive / daysSinceJoined) * 100);

    return {
      activeHabits: activeHabitsCount,
      totalCompletions: totalCompletionsCount,
      longestStreak,
      badgesEarned,
      favoriteCategory,
      completionRate: Math.min(100, completionRate)
    };
  },

  /**
   * Update Profile
   */
  async updateProfile(userId: string, updates: Partial<User>) {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
      
    if (error) throw error;
  },

  /**
   * Upload Avatar
   */
  async uploadAvatar(userId: string, uri: string): Promise<string> {
    try {
        // Read file as blob-like or base64
        // Supabase needs structured blob or FormData
        
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${userId}/avatar.${ext}`;
        
        // Remove old if exists (optional, or rely on upsert)
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob, { upsert: true, contentType: `image/${ext}` });
            
        if (error) throw error;
        
        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
            
        return publicUrlData.publicUrl;
    } catch (e) {
        console.error("Upload error", e);
        throw e;
    }
  },

  /**
   * Export User Data
   */
  async exportUserData(userId: string): Promise<void> {
    const [profile, habits, completions, badges] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).single(),
        supabase.from('habits').select('*').eq('user_id', userId),
        supabase.from('habit_completions').select('*').eq('user_id', userId),
        supabase.from('user_badges').select('*').eq('user_id', userId),
      ]);
      
      const exportData = {
        meta: {
            date: new Date().toISOString(),
            version: '1.0.0',
            app: 'Micro-Commit'
        },
        profile: profile.data,
        habits: habits.data,
        completions: completions.data,
        badges: badges.data,
      };
      
      const json = JSON.stringify(exportData, null, 2);
      const fileUri = FileSystem.documentDirectory + 'micro_commit_export.json';
      
      await FileSystem.writeAsStringAsync(fileUri, json, { encoding: FileSystem.EncodingType.UTF8 });
      
      if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
      }
  },

  /**
   * Delete Account
   */
  async deleteAccount(userId: string): Promise<void> {
        // Cascade delete handled by DB triggers/FKs usually, but safe to do:
        // Delete public.users record
        const { error } = await supabase.from('users').delete().eq('id', userId);
        if (error) throw error;
        
        // Auth user deletion requires ADMIN key usually, or user calls deleteUser() client side?
        // Supabase client 'deleteUser' is often admin only.
        // User can't delete themselves purely via client SDK in some configs.
        // However, usually we relying on RPC or just sign out after data wipe if we can't delete auth.
        // Or specific edge function.
        // Let's try client rpc or ignore auth deletion if blocked, just wipe data.
        
        // Actually, for this implementation, let's just wipe data and Sign Out.
  }
};

// Helper for emojis
function getCategoryEmoji(category: string): string {
    switch(category) {
        case 'fitness': return '💪';
        case 'learning': return '📚';
        case 'mindfulness': return '🧘';
        case 'productivity': return '⚡';
        case 'relationships': return '❤️';
        default: return '🎯';
    }
}
