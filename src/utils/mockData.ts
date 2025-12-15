import { User, Habit, HabitCompletion, Badge } from '../types';

export const MOCK_USER: User = {
  id: 'user-123',
  email: 'test@example.com',
  display_name: 'Test User',
  avatar_url: 'https://i.pravatar.cc/300',
  created_at: new Date().toISOString(),
  total_badges: 5,
  longest_streak: 12
};

export const MOCK_HABITS: Habit[] = [
  {
    id: 'habit-1',
    user_id: 'user-123',
    name: 'Morning Stretch',
    duration_seconds: 120,
    category: 'fitness',
    icon: '🧘',
    color: '#fc8181',
    is_active: true,
    current_streak: 5,
    best_streak: 10,
    total_completions: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'habit-2',
    user_id: 'user-123',
    name: 'Drink Water',
    duration_seconds: 30,
    category: 'fitness',
    icon: '💧',
    color: '#4299e1',
    is_active: true,
    current_streak: 2,
    best_streak: 15,
    total_completions: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'habit-3',
    user_id: 'user-123',
    name: 'Read 1 Page',
    duration_seconds: 120,
    category: 'learning',
    icon: '📖',
    color: '#9f7aea',
    is_active: true,
    current_streak: 0,
    best_streak: 7,
    total_completions: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const MOCK_COMPLETIONS: HabitCompletion[] = [
  {
    id: 'comp-1',
    habit_id: 'habit-1',
    user_id: 'user-123',
    completed_at: new Date().toISOString(),
    verification_method: 'self_report'
  }
];
