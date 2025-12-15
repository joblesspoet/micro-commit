import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService, ProfileStats } from '../services/profile.service';
import { Alert } from 'react-native';

export const useProfile = () => {
  const { user, refreshProfile: refreshAuthProfile, signOut } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await profileService.getProfileStats(user.id);
      setStats(data);
    } catch (error) {
      console.error('Failed to load profile stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const updateName = async (newName: string) => {
    if (!user?.id) return;
    try {
      setActionLoading(true);
      if (newName.length < 2 || newName.length > 50) {
          throw new Error('Name must be 2-50 characters');
      }
      
      await profileService.updateProfile(user.id, { display_name: newName });
      await refreshAuthProfile(); // Update context
      Alert.alert('Success', 'Profile updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update name');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!user?.id) return;
    try {
      setActionLoading(true);
      const publicUrl = await profileService.uploadAvatar(user.id, uri);
      
      // Update profile with new avatar URL
      await profileService.updateProfile(user.id, { avatar_url: publicUrl });
      await refreshAuthProfile();
      
      Alert.alert('Success', 'Avatar updated!');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
        setActionLoading(false);
    }
  };

  const handleExport = async () => {
    if (!user?.id) return;
    try {
      setActionLoading(true);
      await profileService.exportUserData(user.id);
      // Sharing handled in service, or we show toast here
    } catch (error: any) {
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    try {
        await profileService.deleteAccount(user.id);
        await signOut();
    } catch (error: any) {
        Alert.alert("Error", "Could not fully delete account. Please contact support.");
    }
  };

  return {
    stats,
    loading,
    actionLoading,
    refreshProfile: loadStats,
    updateName,
    uploadImage,
    handleExport,
    handleDeleteAccount
  };
};
