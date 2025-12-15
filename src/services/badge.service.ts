import { supabase } from '../api/supabase';
import { BADGES } from '../constants/badges';
import { Badge, UserBadge } from '../types';

export const badgeService = {
  getAllBadges(): Badge[] {
    // Return local constant badges, or could fetch from DB if they were dynamic
    return BADGES.map(b => ({
        ...b,
        badge_type: 'streak', // simplify for now
    }));
  },

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as UserBadge[];
  },

  async checkBadgeEligibility(userId: string, currentStreak: number): Promise<Badge | null> {
    // Check which badges match the current streak
    const eligibleBadge = BADGES.find(b => b.requiredDays === currentStreak);
    
    if (!eligibleBadge) return null;

    // Check if user already has it
    const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('badge_id', eligibleBadge.id)
        .single();
        
    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) return null; // Already has it

    return {
        ...eligibleBadge,
        badge_type: 'streak'
    };
  },

  async awardBadge(userId: string, badgeId: string, habitId?: string): Promise<UserBadge> {
    const { data, error } = await supabase
      .from('user_badges')
      .insert([{
        user_id: userId,
        badge_id: badgeId,
        habit_id: habitId,
        awarded_at: new Date().toISOString(),
        is_claimed: false 
      }])
      .select()
      .single();

    if (error) throw error;
    return data as UserBadge;
  },

  getNextBadge(currentStreak: number): { badge: Badge, daysRemaining: number } | null {
      const nextBadge = BADGES
        .sort((a, b) => a.requiredDays - b.requiredDays)
        .find(b => b.requiredDays > currentStreak);
        
      if (!nextBadge) return null;
      
      return {
          badge: { ...nextBadge, badge_type: 'streak' },
          daysRemaining: nextBadge.requiredDays - currentStreak
      };
  }
};
