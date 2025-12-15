import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CATEGORIES } from '../../constants/categories';
import { colors } from '../../constants/theme';

interface CategoryIconProps {
  category: string;
  size?: number;
  showBackground?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 40,
  showBackground = true 
}) => {
  const cat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  
  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: showBackground ? (cat.color + '20') : 'transparent' // 20% opacity
      }
    ]}>
      <Text style={{ fontSize: size * 0.5 }}>{cat.emoji}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
