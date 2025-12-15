import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface CompletionButtonProps {
  isCompleted: boolean;
  onPress: () => void;
  isLoading?: boolean;
}

export const CompletionButton: React.FC<CompletionButtonProps> = ({ 
  isCompleted, 
  onPress,
  isLoading
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (isLoading || isCompleted) return;

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.bounce
      })
    ]).start();

    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={isCompleted || isLoading}
    >
      <Animated.View style={[
        styles.circle,
        isCompleted && styles.completed,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        {isCompleted && (
          <Animated.Text style={styles.check}>✓</Animated.Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  completed: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  check: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
