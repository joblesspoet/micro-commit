import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'flat' | 'outlined';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  variant = 'elevated',
  padding = 16 
}) => {
  return (
    <View style={[
      styles.container,
      variant === 'elevated' && styles.elevated,
      variant === 'outlined' && styles.outlined,
      { padding },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
  },
  elevated: {
    ...shadows.small,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  }
});
