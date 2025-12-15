import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadows } from '../../constants/theme';
import { Text } from 'react-native';

interface FABProps {
  onPress: () => void;
  icon?: string; // Emoji or custom
}

export const FAB: React.FC<FABProps> = ({ onPress, icon = '+' }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6', // Purple
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
    zIndex: 100,
  },
  icon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -2, 
  }
});
