export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  total_badges: number;
  longest_streak: number;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  duration_seconds: number; // max 120
  category: 'fitness' | 'learning' | 'mindfulness' | 'productivity' | 'relationships';
  icon: string;
  color: string;
  is_active: boolean;
  current_streak: number;
  best_streak: number;
  total_completions: number;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  verification_method: 'self_report' | 'photo' | 'watch' | 'partner';
  notes?: string;
  photo_url?: string;
  duration_actual?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  required_days: number;
  badge_type: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  habit_id?: string;
  awarded_at: string;
  is_claimed: boolean;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_completion_date: string | null;
}

export interface DashboardData {
  user: User;
  habits: Habit[];
  todayCompletions: HabitCompletion[];
  stats: {
    currentStreak: number;
    todayProgress: { completed: number; total: number };
    weeklyProgress: number;
    totalBadges: number;
  };
  upcomingBadge?: {
    badge: Badge;
    daysRemaining: number;
  };
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  AddHabit: undefined;
  EditHabit: { habitId: string };
  HabitCheckin: { habitId: string };
  HabitSuccess: { habitId: string; habitName: string; newStreak: number };
  Profile: undefined;
};
