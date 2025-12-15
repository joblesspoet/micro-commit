import { useHabits as useHabitsContext } from '../context/HabitsContext';

export const useHabits = () => {
  return useHabitsContext();
};
