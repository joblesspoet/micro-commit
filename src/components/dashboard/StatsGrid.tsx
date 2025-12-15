import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatCard } from './StatCard';
import { DashboardData } from '../../types';

interface StatsGridProps {
  stats: DashboardData['stats'];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatCard 
          label="Day Streak"
          value={stats.currentStreak}
          icon="🔥"
          valueColor="#7C3AED" // Purple
        />
        <View style={styles.spacer} />
        <StatCard 
          label="Completed Today"
          value={`${stats.todayProgress.completed}/${stats.todayProgress.total}`}
          valueColor="#7C3AED" // Purple
        />
      </View>
      
      <View style={[styles.row, { marginTop: 12 }]}>
        <StatCard 
          label="This Week"
          value="85%" // Mocked graph replacement for now, or text
          valueColor="#7C3AED"
          // We'd ideally put a graph here, but for now specific styling
          isGraph // boolean to trigger mock graph rendering in StatCard if we modify it
        />
        <View style={styles.spacer} />
        <StatCard 
          label="Badges Earned"
          value={stats.totalBadges}
          icon="🏆"
          valueColor="#7C3AED"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
  },
  spacer: {
    width: 12,
  },
});
import { colors } from '../../constants/theme';
