import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/common/Button';
import { ConfettiCelebration } from '../../components/animations/ConfettiCelebration';
import { MainStackParamList } from '../../types';
import { colors, typography } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

type HabitSuccessRouteProp = RouteProp<MainStackParamList, 'HabitSuccess'>;

const HabitSuccessScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<HabitSuccessRouteProp>();
    
    // Safely destructure params with defaults
    const { 
        habitId, 
        habitName = 'Habit', 
        newStreak = 1 
    } = route.params || {};

    useEffect(() => {
        // Double success haptic
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => {
             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 500);
    }, []);

    const handleContinue = () => {
        navigation.navigate('Dashboard' as never);
    };

    return (
        <View style={styles.container}>
            <ConfettiCelebration />
            
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                     <TouchableOpacity onPress={handleContinue} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                     </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    
                    {/* Hero Image (Emoji or Asset) */}
                    <View style={styles.heroContainer}>
                        <Text style={{ fontSize: 80 }}>🎉</Text>
                    </View>

                    <Text style={styles.title}>Habit Completed!</Text>
                    <Text style={styles.subtitle}>
                        You just did <Text style={styles.highlight}>{habitName}</Text>. That's 1 more than yesterday's you.
                    </Text>

                    {/* Stats Grid */}
                    <View style={styles.grid}>
                        <View style={styles.card}>
                            <Text style={styles.cardValue}>{newStreak} 🔥</Text>
                            <Text style={styles.cardLabel}>DAY STREAK</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={[styles.cardValue, { color: '#8B5CF6' }]}>42</Text>
                            <Text style={styles.cardLabel}>TOTAL COMPLETED</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={[styles.cardValue, { color: '#10B981' }]}>100%</Text>
                            <Text style={styles.cardLabel}>THIS WEEK</Text>
                        </View>
                        <View style={[styles.card, { backgroundColor: '#FFFBEB' }]}>
                             <Text style={{ fontSize: 32 }}>🥇</Text>
                             <Text style={[styles.cardLabel, { color: '#D97706', marginTop: 4 }]}>BADGE UNLOCKED</Text>
                        </View>
                    </View>

                    {/* Achievement Banner */}
                    <View style={styles.achievementBanner}>
                         <View style={styles.trophyContainer}>
                            <Text style={{ fontSize: 40 }}>🏆</Text>
                         </View>
                         <View style={styles.achievementContent}>
                             <Text style={styles.achievementLabel}>🎉 ACHIEVEMENT UNLOCKED!</Text>
                             <Text style={styles.achievementTitle}>{newStreak}-Day Warrior Badge</Text>
                             <Text style={styles.achievementDesc}>Consistency is key! You showed up {newStreak} days in a row.</Text>
                         </View>
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <Button 
                        title="Back to Dashboard" 
                        onPress={handleContinue}
                        style={{ width: '100%', marginBottom: 16 }}
                    />
                    <TouchableOpacity style={styles.shareButton}>
                        <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
                        <Text style={styles.shareText}>Share Achievement</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        alignItems: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    closeButton: {
        padding: 8,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    heroContainer: {
        marginBottom: 24,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    highlight: {
        color: '#8B5CF6',
        fontWeight: 'bold',
    },
    // Grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    card: {
        width: '48%', // Approx half with gap
        backgroundColor: '#F9FAFB',
        borderRadius: 20, // Rounded cards
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1.1, // Slightly wider than square
    },
    cardValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    cardLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 1,
        textAlign: 'center',
    },
    // Banner
    achievementBanner: {
        width: '100%',
        backgroundColor: '#8B5CF6', // Purple gradient start
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        // In real app, use Linear Gradient: colors={['#8B5CF6', '#C026D3']}
    },
    trophyContainer: {
        marginRight: 16,
    },
    achievementContent: {
        flex: 1,
    },
    achievementLabel: {
        color: '#FDE047', // Yellow
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
    achievementTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    achievementDesc: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        lineHeight: 18,
    },
    // Footer
    footer: {
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    shareText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    }
});

export default HabitSuccessScreen;
