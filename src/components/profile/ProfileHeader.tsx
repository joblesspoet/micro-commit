import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../types';
import { colors, typography } from '../../constants/theme';
import { format } from 'date-fns';

interface ProfileHeaderProps {
  user: User;
  onEditPress: () => void;
}

const getInitials = (displayName: string): string => {
  if (!displayName) return '??';
  const names = displayName.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const getAvatarColor = (userId: string): string => {
  const colorsList = ['#667eea', '#4299e1', '#48bb78', '#ed64a6', '#f6ad55', '#F97316', '#8B5CF6'];
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorsList[hash % colorsList.length];
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditPress }) => {
  const memberSince = user.created_at 
    ? format(new Date(user.created_at), 'MMM yyyy') 
    : 'Unknown';

  const avatarColor = getAvatarColor(user.id);
  const initials = getInitials(user.display_name || user.email);

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
          {user.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
          ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: avatarColor }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
              </View>
          )}
          
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={onEditPress}
            activeOpacity={0.8}
          >
              <Ionicons name="camera" size={14} color="#fff" />
          </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.display_name || 'Anonymous User'}</Text>
          <Text style={styles.joined}>Member since {memberSince}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  joined: {
    fontSize: 14,
    color: '#6B7280',
  },
});
