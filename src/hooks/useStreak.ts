import { useState, useEffect } from 'react';
import { streakService } from '../services/streak.service';

export const useStreak = (habitId: string) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isStreakActive, setIsStreakActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreakData();
  }, [habitId]);

  const loadStreakData = async () => {
    try {
      setLoading(true);
      const [current, longest, active] = await Promise.all([
        streakService.calculateCurrentStreak(habitId),
        streakService.getLongestStreak(habitId),
        streakService.isStreakActive(habitId)
      ]);
      
      setCurrentStreak(current);
      setLongestStreak(longest);
      setIsStreakActive(active);
    } catch (e) {
      console.error('Error loading streak data', e);
    } finally {
      setLoading(false);
    }
  };

  return { currentStreak, longestStreak, isStreakActive, loading, refresh: loadStreakData };
};
