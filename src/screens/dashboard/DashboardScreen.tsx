import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatsGrid } from '../../components/dashboard/StatsGrid';
import { HabitCard } from '../../components/habits/HabitCard';
import { HabitListEmpty } from '../../components/habits/HabitListEmpty';
import { FAB } from '../../components/common/FAB';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { colors, typography } from '../../constants/theme';
import { isSameDate } from '../../utils/dateHelpers';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types';

type DashboardScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Dashboard'>;

const DashboardScreen = () => {
    const navigation = useNavigation<DashboardScreenNavigationProp>();
    const { data, loading, refresh } = useDashboardStats();

    // Re-fetch on focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refresh();
        });
        return unsubscribe;
    }, [navigation, refresh]);

    if (loading && !data) {
        return <LoadingSpinner text="Loading your dashboard..." />;
    }

    if (!data) return null; // Should handle error state better

    const isHabitCompletedToday = (habitId: string) => {
        const today = new Date().toISOString();
        return data.todayCompletions.some(c => 
            c.habit_id === habitId && isSameDate(c.completed_at, today)
        );
    };

    const handleHabitPress = (habitId: string) => {
        // Navigate to details or checkin
        navigation.navigate('HabitCheckin', { habitId });
    };

    const handleHabitCompletion = (habit: any, newStreak: number) => {
        navigation.navigate('HabitSuccess', { 
            habitId: habit.id,
            habitName: habit.name,
            newStreak 
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={data.habits}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <HabitCard 
                        habit={item} 
                        isCompleted={isHabitCompletedToday(item.id)}
                        onPress={() => handleHabitPress(item.id)}
                        onComplete={(newStreak) => handleHabitCompletion(item, newStreak)}
                    />
                )}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <DashboardHeader 
                            user={data.user} 
                            onProfilePress={() => navigation.navigate('Profile' as never)} 
                        />
                        <StatsGrid stats={data.stats} />
                        <Text style={styles.sectionTitle}>Your Micro-Habits</Text>
                    </View>
                }
                ListEmptyComponent={<HabitListEmpty />}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refresh} colors={[colors.primary]} />
                }
            />
            
            <FAB onPress={() => navigation.navigate('AddHabit' as never)} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Light grey matching other screens
    },
    listContent: {
        padding: 24,
        paddingBottom: 100, // Space for FAB
    },
    headerContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
        marginTop: 8,
    },
});

export default DashboardScreen;
