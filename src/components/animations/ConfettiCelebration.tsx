import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    withRepeat, 
    withSequence,
    withDelay
} from 'react-native-reanimated';
import { colors } from '../../constants/theme';

const COUNT = 50;
const { width } = Dimensions.get('window');

interface ConfettiPieceProps {
    index: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index }) => {
    const startX = Math.random() * width;
    const endX = Math.random() * width;
    const endY = Math.random() * 500 + 400; // Drop distance
    const rotation = Math.random() * 360;
    const duration = Math.random() * 1000 + 1500;
    const delay = Math.random() * 500;
    const size = Math.random() * 8 + 4;
    const color = [colors.primary, colors.success, colors.warning, colors.danger, '#FFD700'][Math.floor(Math.random() * 5)];

    const translateY = useSharedValue(-20);
    const translateX = useSharedValue(startX);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        translateY.value = withDelay(delay, withTiming(endY, { duration }));
        translateX.value = withDelay(delay, withTiming(endX, { duration }));
        rotate.value = withDelay(delay, withTiming(rotation + 360 * 2, { duration }));
        opacity.value = withDelay(delay + duration * 0.8, withTiming(0, { duration: duration * 0.2 }));
    }, []);

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { translateX: translateX.value },
                { rotate: `${rotate.value}deg` }
            ],
            opacity: opacity.value,
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 4, // slight roundness
            position: 'absolute',
            top: 0,
            left: 0,
        };
    });

    return <Animated.View style={style} />;
};

export const ConfettiCelebration = () => {
    const [pieces] = useState(Array.from({ length: COUNT }).map((_, i) => i));

    return (
        <View style={styles.container} pointerEvents="none">
            {pieces.map(i => <ConfettiPiece key={i} index={i} />)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        elevation: 1000,
        overflow: 'hidden',
    }
});
