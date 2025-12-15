import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useHabits } from '../../hooks/useHabits';
import { useHabitCompletion } from '../../hooks/useHabitCompletion';
import { MainStackParamList } from '../../types';
import { colors, typography } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import { isToday } from '@/utils/dateHelpers';

type HabitCheckinRouteProp = RouteProp<MainStackParamList, 'HabitCheckin'>;

const HabitCheckinScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<HabitCheckinRouteProp>();
    const { habitId } = route.params;
    const { habits, todayCompletions } = useHabits();
    const { performCompletion, isSubmitting } = useHabitCompletion();
    
    const habit = habits.find(h => h.id === habitId);
    
    // Check if completed today based on context
    const isCompletedToday = React.useMemo(() => {
        if (!habit) return false;
        
        return todayCompletions.some(c => 
            c.habit_id === habitId && isToday(c.completed_at)
        );
    }, [habit, todayCompletions, habitId]);
    
    // Header customization
    useEffect(() => {
        navigation.setOptions({
            headerShown: false, // We build our own header
        });
    }, [navigation]);

    // Check if already completed on mount - REMOVED annoying alert
    // Instead we will render the button as "Completed"
    
    // Handle Button Press
    const handleMainAction = async () => {
        if (!habit) return;
        
        if (isCompletedToday) {
             // If already completed, maybe allow UNDO? Or just show status?
             // For now, let's treat it as "Un-complete" action or just show toast "Good job!"
             Alert.alert("Great Job!", "You've already crushed this habit today! 🔥");
             return;
        }

        try {
            // Call service to complete habit
            await performCompletion(habitId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

             navigation.navigate('HabitSuccess' as never, { 
                habitId, 
                habitName: habit.name,
                newStreak: habit.current_streak + 1 
            } as never);

        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Error", error.message || "Failed to update habit.");
        }
    };
    
    if (!habit) return null;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MICRO-COMMIT</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                {/* Hero Icon */}
                <View style={styles.heroIconContainer}>
                    <Text style={{ fontSize: 64 }}>{habit.icon || '💪'}</Text>
                </View>

                {/* Title & Subtitle */}
                <Text style={styles.title}>{habit.name}</Text>
                <Text style={styles.subtitle}>
                    This takes just {Math.round(habit.duration_seconds / 60)} seconds{'\n'}
                    <Text style={styles.highlight}>You've got this!</Text>
                </Text>

                {/* Tap Button - Dynamic State */}
                    <View style={styles.buttonWrapper}>
                         <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleMainAction}
                            disabled={isSubmitting}
                            style={[
                                styles.tapButtonContainer,
                                isCompletedToday && styles.completedButtonContainer
                            ]}
                         >
                            <LinearGradient
                                colors={isCompletedToday ? ['#10B981', '#059669'] : ['#A855F7', '#8B5CF6']}
                                style={styles.tapButton}
                            >
                                <Ionicons 
                                    name={isCompletedToday ? "checkmark-circle" : "finger-print"} 
                                    size={32} 
                                    color="white" 
                                    style={{ marginBottom: 8 }} 
                                />
                                <Text style={styles.tapButtonText}>
                                    {isCompletedToday ? "COMPLETED!" : "TAP WHEN\nDONE"}
                                </Text>
                            </LinearGradient>
                         </TouchableOpacity>
                         
                         {/* Glow effect hack - hide if completed */}
                         {!isCompletedToday && <View style={styles.glow} />}
                    </View>

                {/* Stats Card */}
                <View style={styles.statsCard}>
                    <View style={styles.statsRow}>
                        <Text style={styles.statsLabel}>Current Streak</Text>
                        <View style={styles.streakPill}>
                            <Text style={styles.streakText}>{habit.current_streak} days 🔥</Text>
                        </View>
                    </View>
                    
                    {/* Progress Bar */}
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: '70%' }]} /> 
                    </View>

                    <Text style={styles.nextBadgeText}>
                        3 more days to unlock <Text style={{ color: '#8B5CF6', fontWeight: 'bold' }}>10-Day Champion badge!</Text>
                    </Text>
                </View>

            </ScrollView>
            
            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color="#6B7280" style={{ marginRight: 8 }} />
                    <Text style={styles.backButtonText}>Back to Dashboard</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    headerBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 1,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
    },
    heroIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    highlight: {
        color: '#8B5CF6',
        fontWeight: 'bold',
    },
    // Tap Button
    buttonWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 200,
        marginBottom: 40,
    },
    tapButtonContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        zIndex: 10,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    completedButtonContainer: {
        shadowColor: '#10B981',
    },
    tapButton: {
        flex: 1,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tapButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
    glow: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        zIndex: 1,
    },
    // Stats Card
    statsCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statsLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    streakPill: {
        backgroundColor: '#FFEDD5', // Light Orange
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    streakText: {
        color: '#F97316', // Orange
        fontWeight: 'bold',
        fontSize: 14,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        width: '100%',
        marginBottom: 16,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#A855F7',
        borderRadius: 4,
    },
    nextBadgeText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    // Footer
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        alignItems: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    backButtonText: {
        color: '#6B7280',
        fontWeight: '600',
        fontSize: 14,
    }
});

export default HabitCheckinScreen;
