import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../constants/theme';

interface PaginationDotsProps {
  total: number;
  currentIndex: number;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({ total, currentIndex }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.active : styles.inactive
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  active: {
    backgroundColor: '#3b82f6', // Bright blue as in screenshot
    width: 24, // Elongated active dot
  },
  inactive: {
    backgroundColor: '#e5e7eb', // Light grey
  }
});
