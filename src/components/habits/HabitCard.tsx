import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Habit } from '../../types';
import { Card } from '../common/Card';
import { CategoryIcon } from './CategoryIcon';
import { StreakDisplay } from './StreakDisplay';
import { CompletionButton } from './CompletionButton';
import { colors, typography } from '../../constants/theme';
import { useHabitCompletion } from '../../hooks/useHabitCompletion';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onPress: () => void;
  onComplete?: (newStreak: number) => void;
}

// Helper to get color/emoji based on logic, or random but consistent
const getTheme = (id: string, category: string) => {
    // Design has specific colors per item, let's map or just hardcode visually for now
    // Morning Stretch: Orange/Yellow
    // Hydrate: Blue
    // Read: Yellow/Red
    // Tidy: Pink
    // For now we rely on the `CategoryIcon` to give us the left icon
    // We need to style the container significantly
};

export const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted, onPress, onComplete }) => {
  const { performCompletion, performUndo, isSubmitting } = useHabitCompletion();

  // Use habit color or default to orange/primary
  const themeColor = habit.color || '#F97316';
  const bgColor = `${themeColor}10`; // 10% opacity hex
  const lightColor = `${themeColor}20`;

  const handleCompletion = async () => {
    if (isSubmitting) return;

    if (!isCompleted) {
        const result = await performCompletion(habit.id);
        if (result && onComplete) {
            onComplete(habit.current_streak + 1);
        }
    } else {
        // Toggle off (Undo)
        await performUndo(habit.id);
    }
  };

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, isCompleted && styles.completedContainer]}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
            <Text style={{ fontSize: 24 }}>{habit.icon || '📝'}</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.title, isCompleted && styles.completedTitle]}>
            {habit.name}
          </Text>
          <Text style={styles.meta}>
            {Math.round(habit.duration_seconds / 60)} min • {habit.category}
          </Text>
        </View>

        <View style={styles.rightSection}>
            <View style={[styles.streakPill, { backgroundColor: lightColor }]}>
                 <Text style={[styles.streakText, { color: themeColor }]}>{habit.current_streak}</Text>
                 <Text>🔥</Text>
            </View>

            <Pressable 
                onPress={(e) => {
                    e.stopPropagation(); // CRITICAL: Stop propagation to parent card
                    handleCompletion();
                }} 
                disabled={isSubmitting}
                style={[
                    styles.checkbox,
                    isCompleted ? { backgroundColor: themeColor, borderColor: themeColor } : styles.unchecked
                ]}
            >
                {isCompleted && <Text style={styles.checkIcon}>✓</Text>}
            </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  completedContainer: {
      opacity: 0.8,
  },
  iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  completedTitle: {
      color: '#9CA3AF',
      textDecorationLine: 'line-through',
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
  },
  rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  streakPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
  },
  streakText: {
      fontSize: 12,
      fontWeight: 'bold',
  },
  checkbox: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
  },
  unchecked: {
      borderColor: '#E5E7EB',
      backgroundColor: '#fff',
  },
  checkIcon: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
  }
});
