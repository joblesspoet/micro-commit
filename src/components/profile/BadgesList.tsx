import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useBadges } from '../../hooks/useBadges';
import { Badge } from '../../types';

interface BadgeItemProps {
    badge: Badge;
    earned: boolean;
    onPress: () => void;
}

const BadgeItem = ({ badge, earned, onPress }: BadgeItemProps) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.badgeItem, !earned && styles.lockedBadge]}>
        <View style={[styles.iconContainer, !earned && styles.lockedContainer]}>
            <Text style={styles.icon}>{badge.icon}</Text>
            {!earned && <View style={styles.lockOverlay}><Ionicons name="lock-closed" size={12} color="#9CA3AF" /></View>}
        </View>
        <Text style={styles.badgeName} numberOfLines={1}>{badge.name}</Text>
    </TouchableOpacity>
);

import { Ionicons } from '@expo/vector-icons'; // Added import

export const BadgesList: React.FC = () => {
    const { allBadges, userBadges, loading } = useBadges();

    const handleBadgePress = (badge: Badge, earned: boolean) => {
        Alert.alert(
            badge.name, 
            `${badge.description}\n\n${earned ? "✅ Earned!" : `🔒 Complete ${badge.required_days} days to unlock`}`
        );
    };

    if (loading) return <View style={{ height: 100 }} />; // or spinner

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {allBadges.map(badge => {
                    const isEarned = userBadges.some(ub => ub.badge_id === badge.id);
                    return (
                        <BadgeItem 
                            key={badge.id}
                            badge={badge}
                            earned={isEarned}
                            onPress={() => handleBadgePress(badge, isEarned)}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
      marginBottom: 24,
  },
  headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 4,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
  },
  viewAllText: {
      fontSize: 14,
      color: '#8B5CF6', // Purple
      fontWeight: '600',
  },
  scrollContent: {
      paddingHorizontal: 4,
      paddingBottom: 8,
  },
  badgeItem: {
      marginRight: 20,
      alignItems: 'center',
      width: 80,
  },
  lockedBadge: {
      opacity: 1, // Handle opacity in container
  },
  iconContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: '#FEF3C7', // Light orange/yellow for earned default
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      borderWidth: 2,
      borderColor: '#FDE68A',
  },
  lockedContainer: {
      backgroundColor: '#F3F4F6',
      borderColor: '#E5E7EB',
  },
  icon: {
      fontSize: 32,
  },
  lockOverlay: {
      position: 'absolute',
      // Center lock? Or corner? Design shows center lock icon instead of emoji sometimes
      // Let's simplified corner
      bottom: 0,
      right: 0,
      backgroundColor: '#E5E7EB',
      borderRadius: 10,
      padding: 4,
  },
  badgeName: {
      fontSize: 12,
      fontWeight: '600',
      color: '#111827',
      textAlign: 'center',
  },
});
