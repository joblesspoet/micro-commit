import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withDelay
} from 'react-native-reanimated';
import { colors, typography } from '../../constants/theme';

export const SuccessAnimation = () => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(1, { damping: 10 });
        opacity.value = withDelay(200, withSpring(1));
    }, []);

    const circleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const messageStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: withSpring(0) }]
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circle, circleStyle]}>
                <Text style={styles.check}>✓</Text>
            </Animated.View>
            <Animated.Text style={[styles.message, messageStyle]}>
                Habit Completed!
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: colors.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    check: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    },
    message: {
        fontSize: typography.sizes.xl,
        fontWeight: 'bold',
        color: colors.textPrimary,
    }
});
