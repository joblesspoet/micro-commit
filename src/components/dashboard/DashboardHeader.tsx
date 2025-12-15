import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../../types';
import { Avatar } from '../common/Avatar';
import { colors, typography } from '../../constants/theme';
import { isToday, format } from 'date-fns';

interface DashboardHeaderProps {
  user: User;
  onProfilePress?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onProfilePress }) => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>{greeting()}, {user.display_name.split(' ')[0]}!</Text>
        <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</Text>
      </View>
      
      <TouchableOpacity onPress={onProfilePress}>
         <Avatar name={user.display_name} url={user.avatar_url} size={48} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24, // Matches visual
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});
