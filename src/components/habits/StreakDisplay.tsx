import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';

interface StreakDisplayProps {
  streak: number;
  highlight?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, highlight = false }) => {
  if (streak === 0) return null;

  return (
    <View style={[styles.container, highlight && styles.highlight]}>
      <Text style={[styles.text, highlight && styles.highlightText]}>
        {streak} 🔥
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  highlight: {
    backgroundColor: colors.primary + '20',
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  highlightText: {
    color: colors.primary,
  }
});
