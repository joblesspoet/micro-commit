import { supabase } from '../api/supabase';
import { differenceInDays, startOfDay, subDays, startOfWeek, endOfWeek, format } from 'date-fns';

export const statsService = {
  async getCurrentDayStreak(userId: string): Promise<number> {
    // 1. Get all active habits
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (habitsError) throw habitsError;
    if (!habits || habits.length === 0) return 0;

    let maxStreak = 0;

    // 2. For each habit, calculate streak
    // Ideally this is done in SQL for performance, but for MVP JS logic is fine
    for (const habit of habits) {
        const { data: completions } = await supabase
            .from('habit_completions')
            .select('completed_at')
            .eq('habit_id', habit.id)
            .order('completed_at', { ascending: false });

        if (!completions || completions.length === 0) continue;

        let streak = 0;
        let checkDate = startOfDay(new Date());
        
        // Normalize completion dates to strings YYYY-MM-DD for comparison
        const completionDates = new Set(
            completions.map(c => format(new Date(c.completed_at), 'yyyy-MM-dd'))
        );

        // Check today first
        if (completionDates.has(format(checkDate, 'yyyy-MM-dd'))) {
            streak++;
        } 
        
        // Iterate backwards
        // If today was checked, next check is yesterday
        // If today NOT checked, we still check yesterday to keep streak alive?
        
        // Re-implementing specific provided logic strictly:
        // "Start counting from today backwards"
        let currentCheck = startOfDay(new Date());
        let currentStreak = 0;
        
        for (let i = 0; i < 365; i++) {
             const dateStr = format(currentCheck, 'yyyy-MM-dd');
             const hasCompletion = completionDates.has(dateStr);
             
             if (hasCompletion) {
                 currentStreak++;
             } else {
                 // If checking TODAY (i=0) and missed, it's fine, streak might still be alive from yesterday
                 if (i === 0) {
                     // continue to check yesterday without increments
                 } else {
                     break; // Streak broken
                 }
             }
             currentCheck = subDays(currentCheck, 1);
        }
        
        if (currentStreak > maxStreak) maxStreak = currentStreak;
    }

    return maxStreak;
  },

  async getTodayProgress(userId: string): Promise<{ completed: number, total: number }> {
    // Total active habits
    const { count: total, error: habitsError } = await supabase
        .from('habits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_active', true);
    
    if (habitsError) throw habitsError;

    // Distinct completions today
    const { count: completed, error: completionsError } = await supabase
        .from('habit_completions')
        .select('habit_id', { count: 'exact', head: true }) // Using head if possible, but distinct is tricky with just head
        // Actually Supabase count is simpler:
        // But we need distinct habit_id. 
        // Let's just fetch them for MVP
    
    // Alternative:
    const todayStart = startOfDay(new Date()).toISOString();
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();

    const { data: completions, error } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', userId)
        .gte('completed_at', todayStart)
        .lte('completed_at', todayEnd);

    if (error) throw error;
    
    // Unique habit IDs completed today
    const uniqueCompleted = new Set(completions?.map(c => c.habit_id)).size;

    return { completed: uniqueCompleted, total: total || 0 };
  },

  async getWeeklyProgress(userId: string): Promise<number> {
      // 1. Active habits count
      const { count: activeHabitsCount } = await supabase
          .from('habits')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_active', true);
      
      if (!activeHabitsCount) return 0;
      
      const possibleCompletions = activeHabitsCount * 7;
      
      // 2. Actual completions this week
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(); // Monday start
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();

      const { count: actualCompletions } = await supabase
          .from('habit_completions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('completed_at', weekStart)
          .lte('completed_at', weekEnd);
      
      if (!actualCompletions) return 0;

      return Math.round((actualCompletions / possibleCompletions) * 100);
  },

  async getTotalBadges(userId: string): Promise<number> {
      const { count } = await supabase
          .from('user_badges')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
      
      return count || 0;
  },

  async getDashboardStats(userId: string) {
      const [streak, today, weekly, badges] = await Promise.all([
          this.getCurrentDayStreak(userId),
          this.getTodayProgress(userId),
          this.getWeeklyProgress(userId),
          this.getTotalBadges(userId)
      ]);

      return {
          currentStreak: streak,
          todayProgress: today,
          weeklyProgress: weekly,
          totalBadges: badges
      };
  }
};
