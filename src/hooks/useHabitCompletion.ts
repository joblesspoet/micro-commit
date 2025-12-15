import { useState } from 'react';
import { useHabits } from './useHabits';
import { useHaptics } from './useHaptics';

export const useHabitCompletion = () => {
  const { completeHabit, undoHabitCompletion } = useHabits();
  const { trigger } = useHaptics();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const performCompletion = async (habitId: string, notes?: string) => {
    setIsSubmitting(true);
    try {
      const result = await completeHabit(habitId, notes);
      trigger('success');
      return result;
    } catch (error) {
      console.error('Completion error', error);
      trigger('error');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const performUndo = async (habitId: string) => {
    setIsSubmitting(true);
    try {
      await undoHabitCompletion(habitId);
      trigger('light'); // Muted feedback for undo
    } catch (error) {
       console.error('Undo error', error);
       trigger('error');
    } finally {
        setIsSubmitting(false);
    }
  };

  return { performCompletion, performUndo, isSubmitting };
};
