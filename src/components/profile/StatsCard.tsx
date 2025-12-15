import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProfileStats } from '../../services/profile.service';

interface StatsCardProps {
  stats: ProfileStats | null;
  loading: boolean;
}

const StatItem = ({ label, value, subtext }: { label: string, value: string | number, subtext?: string }) => (
    <View style={styles.statItem}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {subtext && <Text style={styles.statSub}>{subtext}</Text>}
    </View>
);

export const StatsCard: React.FC<StatsCardProps> = ({ stats, loading }) => {
  if (loading || !stats) {
      // Skeleton loader placeholder
      return (
          <View style={styles.container}>
             <View style={styles.row}>
                 <View style={[styles.skeleton, { width: 80, height: 60 }]} />
                 <View style={[styles.skeleton, { width: 80, height: 60 }]} />
                 <View style={[styles.skeleton, { width: 80, height: 60 }]} />
             </View>
             <View style={styles.row}>
                 <View style={[styles.skeleton, { width: 80, height: 60 }]} />
                 <View style={[styles.skeleton, { width: 80, height: 60 }]} />
                 <View style={[styles.skeleton, { width: 80, height: 60 }]} />
             </View>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
          <StatItem label="Active Habits" value={stats.activeHabits} />
          <StatItem label="Total Done" value={stats.totalCompletions} />
          <StatItem label="Best Streak" value={`${stats.longestStreak}🔥`} />
      </View>
      <View style={[styles.divider]} />
      <View style={styles.row}>
          <StatItem label="Badges" value={stats.badgesEarned} />
          <StatItem label="Fav Category" value={stats.favoriteCategory} />
          <StatItem label="Consistency" value={`${stats.completionRate}%`} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
  },
  divider: {
      height: 1,
      backgroundColor: '#F3F4F6',
      marginVertical: 12,
  },
  statItem: {
      flex: 1,
      alignItems: 'center',
  },
  statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#8B5CF6', // Purple color from design match
      marginBottom: 4,
  },
  statLabel: {
      fontSize: 12,
      color: '#6B7280',
      textAlign: 'center',
  },
  statSub: {
      fontSize: 10,
      color: '#9CA3AF',
  },
  skeleton: {
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      margin: 4,
  },
});
