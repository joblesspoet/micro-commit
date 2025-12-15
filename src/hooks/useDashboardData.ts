import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useHabits } from './useHabits';
import { useBadges } from './useBadges';
import { DashboardData } from '../types';

export const useDashboardData = () => {
  const { user } = useAuth();
  const { habits, todayCompletions, refreshHabits, refreshTodayCompletions } = useHabits();
  const { userBadges } = useBadges();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && habits.length >= 0) {
      calculateDashboardData();
    }
  }, [user, habits, todayCompletions, userBadges]);

  const calculateDashboardData = () => {
    if (!user) return;

    // Calculate aggregated stats
    const currentStreak = 0; // Ideally aggregated from all habits or the main one
    // For simplicity, let's say "global streak" is just the sum of all current streaks for now or max
    const maxStreak = Math.max(...habits.map(h => h.current_streak), 0);
    
    // Weekly progress logic would go here
    
    setData({
      user,
      habits,
      todayCompletions,
      stats: {
        currentStreak: maxStreak,
        todayProgress: {
            completed: todayCompletions.length,
            total: habits.length
        },
        weeklyProgress: 0.85, // Mock for now or calc real
        totalBadges: userBadges.length
      }
    });
    setLoading(false);
  };

  const refresh = async () => {
    setLoading(true);
    await Promise.all([refreshHabits(), refreshTodayCompletions()]);
    // Labels re-calc will happen via effect
  };

  return { data, loading, refresh };
};
