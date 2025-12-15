import React, { createContext, useState, useEffect, useContext } from 'react';
import { Habit, HabitCompletion } from '../types';
import { habitService } from '../services/habit.service';
import { useAuth } from './AuthContext';
import { isToday } from '@/utils/dateHelpers';

interface HabitsContextType {
  habits: Habit[];
  isLoading: boolean;
  refreshHabits: () => Promise<void>;
  createHabit: (habit: Partial<Habit>) => Promise<Habit>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<Habit>;
  deleteHabit: (id: string) => Promise<void>;
  completeHabit: (id: string, notes?: string) => Promise<HabitCompletion>;
  undoHabitCompletion: (id: string) => Promise<void>;
  todayCompletions: HabitCompletion[];
  refreshTodayCompletions: () => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType>({} as HabitsContextType);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayCompletions, setTodayCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshHabits();
      refreshTodayCompletions();
    } else {
      setHabits([]);
      setTodayCompletions([]);
    }
  }, [user]);

  /* Helper to check if a habit is completed today based on current state */
  const isHabitCompleted = (habitId: string, currentCompletions: HabitCompletion[]) => {
    return currentCompletions.some(c => 
        c.habit_id === habitId && isToday(c.completed_at) // Use your helper
    );
};

  const sortHabits = (habitsList: Habit[], completions: HabitCompletion[]) => {
      return [...habitsList].sort((a, b) => {
          const aCompleted = isHabitCompleted(a.id, completions);
          const bCompleted = isHabitCompleted(b.id, completions);

          // 1. Incomplete first
          if (aCompleted !== bCompleted) {
              return aCompleted ? 1 : -1;
          }
          // 2. Creation date (oldest first as per business logic, or newest? Logic said: "Then by creation date (oldest first)")
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
  };

  const refreshData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [habitsData, completionsData] = await Promise.all([
          habitService.getUserHabits(user.id),
          habitService.getTodayCompletions(user.id)
      ]);
      
      setTodayCompletions(completionsData);
      
      // Sort and set
      const sorted = sortHabits(habitsData, completionsData);
      setHabits(sorted);
      
    } catch (e) {
      console.error('Error fetching habits data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHabits = async () => {
      await refreshData();
  };

  const refreshTodayCompletions = async () => {
      // Re-fetch just completions but we need to re-sort habits too
      await refreshData();
  };

  const createHabit = async (habitData: Partial<Habit>) => {
    if (!user) throw new Error('No user');
    const newHabit = await habitService.createHabit({ ...habitData, user_id: user.id });
    setHabits(prev => [newHabit, ...prev]);
    return newHabit;
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const updated = await habitService.updateHabit(id, updates);
    setHabits(prev => prev.map(h => h.id === id ? updated : h));
    return updated;
  };

  const deleteHabit = async (id: string) => {
    await habitService.deleteHabit(id);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const completeHabit = async (id: string, notes?: string) => {
    if (!user) throw new Error('No user');
    const completion = await habitService.completeHabit(id, user.id, notes);
    
    // Update local state and RE-SORT
    const newCompletions = [...todayCompletions, completion];
    setTodayCompletions(newCompletions);
    
    setHabits(prev => {
        const updated = prev.map(h => {
            if (h.id === id) {
                return {
                    ...h,
                    current_streak: h.current_streak + 1,
                    total_completions: h.total_completions + 1
                };
            }
            return h;
        });
        return sortHabits(updated, newCompletions);
    });
    
    return completion;
  };

  const undoHabitCompletion = async (id: string) => {
    if (!user) throw new Error('No user');
    await habitService.removeCompletion(id, user.id);
    
    // Update local state and RE-SORT
    const newCompletions = todayCompletions.filter(c => c.habit_id !== id);
    setTodayCompletions(newCompletions);
    
    setHabits(prev => {
        const updated = prev.map(h => {
            if (h.id === id) {
                return {
                    ...h,
                    current_streak: Math.max(0, h.current_streak - 1),
                    total_completions: Math.max(0, h.total_completions - 1)
                };
            }
            return h;
        });
        return sortHabits(updated, newCompletions);
    });
  };

  return (
    <HabitsContext.Provider value={{
      habits,
      isLoading,
      refreshHabits,
      createHabit,
      updateHabit,
      deleteHabit,
      completeHabit,
      undoHabitCompletion,
      todayCompletions,
      refreshTodayCompletions
    }}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => useContext(HabitsContext);
