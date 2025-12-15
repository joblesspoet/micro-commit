import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { FadeInUp, BounceIn } from 'react-native-reanimated';
import { Badge } from '../../types';
import { colors, typography } from '../../constants/theme';
import { ConfettiCelebration } from './ConfettiCelebration';

interface BadgeUnlockProps {
    badge: Badge;
}

export const BadgeUnlock: React.FC<BadgeUnlockProps> = ({ badge }) => {
    return (
        <View style={styles.container}>
            <ConfettiCelebration />
            <Animated.View entering={BounceIn.duration(1000)} style={styles.badgeContainer}>
                <Text style={styles.icon}>{badge.icon}</Text>
            </Animated.View>
            <Animated.Text entering={FadeInUp.delay(500)} style={styles.title}>
                New Badge Unlocked!
            </Animated.Text>
            <Animated.Text entering={FadeInUp.delay(800)} style={styles.name}>
                {badge.name}
            </Animated.Text>
            <Animated.Text entering={FadeInUp.delay(1000)} style={styles.description}>
                {badge.description}
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    badgeContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    icon: {
        fontSize: 60,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 8,
    },
    name: {
        fontSize: typography.sizes['2xl'],
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    description: {
        fontSize: typography.sizes.base,
        color: colors.textSecondary,
        textAlign: 'center',
    }
});
