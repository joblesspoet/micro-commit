import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useHabits } from './useHabits';
import { statsService } from '../services/stats.service';
import { DashboardData } from '../types';
import { supabase } from '../api/supabase';

export const useDashboardStats = () => {
    const { user } = useAuth();
    const { habits, todayCompletions, refreshHabits, refreshTodayCompletions } = useHabits();
    const [stats, setStats] = useState({
        currentStreak: 0,
        todayProgress: { completed: 0, total: 0 },
        weeklyProgress: 0,
        totalBadges: 0
    });
    const [loading, setLoading] = useState(true);

    const refreshStats = useCallback(async () => {
        if (!user) return;
        try {
            const newStats = await statsService.getDashboardStats(user.id);
            setStats(newStats);
        } catch (error) {
            console.error('Error refreshing stats', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initial load
    useEffect(() => {
        refreshStats();
    }, [refreshStats]);

    // Real-time updates for stats
    useEffect(() => {
        if (!user) return;

        const subscription = supabase
            .channel('dashboard_stats_completions')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'habit_completions', filter: `user_id=eq.${user.id}` },
                () => {
                    refreshStats();
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'habit_completions', filter: `user_id=eq.${user.id}` },
                () => {
                    refreshStats();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user, refreshStats]);

    // Construct full data object
    const data: DashboardData | null = user ? {
        user,
        habits,
        todayCompletions,
        stats
    } : null;

    const refresh = async () => {
        setLoading(true);
        await Promise.all([refreshHabits(), refreshTodayCompletions(), refreshStats()]);
        setLoading(false);
    };

    return { data, loading, refresh };
};
