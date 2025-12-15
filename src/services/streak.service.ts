import { supabase } from '../api/supabase';
import { differenceInDays, isSameDay, parseISO } from 'date-fns';

export const streakService = {
  async calculateCurrentStreak(habitId: string): Promise<number> {
    const { data: completions, error } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('habit_id', habitId)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    
    if (!completions || completions.length === 0) return 0;

    // Use a Set for O(1) lookups of "YYYY-MM-DD"
    const completedDates = new Set(
        completions.map(c => c.completed_at.split('T')[0])
    );

    let streak = 0;
    let checkDate = new Date(); // Start from today
    
    // Iterate 365 days backwards
    for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (completedDates.has(dateStr)) {
            streak++;
            // Move back 1 day
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // If checking TODAY (i=0) and it's missing, streak is not necessarily broken *yet*
            // But usually "Current Streak" implies "streak including today if done, or up to yesterday"
            // The prompt says: "Start counting from today backwards... Count consecutive days."
            // AND "User completed yesterday but not today -> Streak continues"
            // So if today is missing, we check yesterday.
            
            if (i === 0) {
                // Today is missing. Move to yesterday and continue.
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
            } else {
                // Streak broken
                break;
            }
        }
    }

    return streak;
  },

  async getLongestStreak(habitId: string): Promise<number> {
    // Similar to above but finding max sequence
      const { data: completions, error } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('habit_id', habitId)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    if (!completions || completions.length === 0) return 0;

    const uniqueDates = Array.from(new Set(completions.map(c => c.completed_at.split('T')[0]))).map(d => parseISO(d));
    
    if (uniqueDates.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const current = uniqueDates[i];
        const prev = uniqueDates[i+1]; // Note: sorted descending, so prev is actually chronologically previous
        
        const diff = differenceInDays(current, prev);
        if (diff === 1) {
            currentStreak++;
        } else {
             if (currentStreak > maxStreak) {
                 maxStreak = currentStreak;
             }
            currentStreak = 1;
        }
    }
    
    if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
    }

    return maxStreak;
  },

  async isStreakActive(habitId: string): Promise<boolean> {
      const { data, error } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('habit_id', habitId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'Row not found'
      if (!data) return false;
      
      const lastDate = parseISO(data.completed_at);
      const today = new Date();
      
      // Streak is active if completed today OR yesterday
      return isSameDay(today, lastDate) || differenceInDays(today, lastDate) === 1;
  }
};
