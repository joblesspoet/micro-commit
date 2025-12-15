import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { colors, typography } from '../../constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: string;
  valueColor?: string;
  isGraph?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon, 
  trend,
  valueColor = '#7C3AED',
  isGraph
}) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.content}>
        <View style={styles.valueRow}>
            <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
            {icon && <Text style={styles.icon}>{icon}</Text>}
        </View>
        
        {isGraph && (
            <View style={styles.mockGraph}>
                <View style={[styles.bar, { height: '30%', backgroundColor: '#E9D5FF' }]} />
                <View style={[styles.bar, { height: '50%', backgroundColor: '#E9D5FF' }]} />
                <View style={[styles.bar, { height: '40%', backgroundColor: '#E9D5FF' }]} />
                <View style={[styles.bar, { height: '60%', backgroundColor: '#E9D5FF' }]} />
                <View style={[styles.bar, { height: '100%', backgroundColor: '#7C3AED' }]} />
            </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    minHeight: 120,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  content: {
      flex: 1,
      justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: '#6B7280', // Grey uppercase
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginLeft: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  mockGraph: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 40,
      gap: 4,
      marginTop: 8,
  },
  bar: {
      flex: 1,
      borderRadius: 4,
      minWidth: 8,
  }
});
