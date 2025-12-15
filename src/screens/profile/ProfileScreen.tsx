import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { colors, typography } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

// Components
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { StatsCard } from '../../components/profile/StatsCard';
import { BadgesList } from '../../components/profile/BadgesList';
import { SettingsList } from '../../components/profile/SettingsList';
import { EditProfileModal } from './EditProfileModal'; // Assuming in same folder or adjustable

const APP_VERSION = '1.0.0';

const ProfileScreen = () => {
    const { user, signOut } = useAuth();
    const { stats, loading, updateName, uploadImage, handleExport, handleDeleteAccount } = useProfile();
    const navigation = useNavigation();
    
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Settings Options
    const settingsOptions = [
        {
            id: 'notifications',
            icon: 'notifications' as const,
            iconColor: '#3B82F6', // Blue
            iconBgColor: '#EFF6FF',
            label: 'Notifications',
            onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available shortly!'),
        },
        {
            id: 'appearance',
            icon: 'color-palette' as const,
            iconColor: '#8B5CF6', // Purple
            iconBgColor: '#F3E8FF',
            label: 'Appearance',
            onPress: () => Alert.alert('Coming Soon', 'Dark mode is on the roadmap!'),
        },
        {
            id: 'habits',
            icon: 'stats-chart' as const,
            iconColor: '#10B981', // Green
            iconBgColor: '#ECFDF5',
            label: 'View All Habits',
            onPress: () => {},//navigation.navigate('HabitsHistory' as never),
        },
        {
            id: 'export',
            icon: 'download' as const,
            iconColor: '#F59E0B', // Orange
            iconBgColor: '#FFFBEB',
            label: 'Export Data',
            onPress: handleExport,
        },
        {
            id: 'privacy',
            icon: 'lock-closed' as const,
            iconColor: '#4B5563', // Gray
            iconBgColor: '#F3F4F6',
            label: 'Privacy & Security',
            onPress: () => {},
        },
        {
            id: 'support',
            icon: 'chatbubble' as const,
            iconColor: '#14B8A6', // Teal
            iconBgColor: '#CCFBF1',
            label: 'Help & Support',
            onPress: () => Alert.alert('Support', 'Contact us at help@microcommit.app'),
        },
        {
            id: 'about',
            icon: 'information-circle' as const,
            iconColor: '#6B7280', // Gray
            iconBgColor: '#F3F4F6',
            label: 'About',
            onPress: () => {},
        }
    ];

    // Configure Navigation Header
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Profile',
            headerShown: true,
            headerRight: () => (
                <TouchableOpacity onPress={() => setEditModalVisible(true)} style={{ marginRight: 16 }}>
                    <Ionicons name="pencil" size={24} color="#8B5CF6" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleSignOutPress = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", style: "destructive", onPress: signOut }
            ]
        );
    };

    if (!user) return null;

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                
                {/* Header Info */}
                <ProfileHeader 
                    user={user} 
                    onEditPress={() => setEditModalVisible(true)} 
                />

                {/* Stats */}
                <StatsCard stats={stats} loading={loading} />

                {/* Badges */}
                <BadgesList />

                {/* Settings */}
                <SettingsList options={settingsOptions} />

                {/* Footer Actions */}
                <View style={styles.footerContainer}>
                    <TouchableOpacity onPress={handleSignOutPress}>
                        <Text style={styles.signOutLink}>Sign Out</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.versionText}>v{APP_VERSION}</Text>
                </View>

            </ScrollView>

            {/* Edit Modal */}
            <EditProfileModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                initialName={user.display_name}
                onSaveName={updateName}
                onUploadImage={uploadImage}
                loading={actionLoading} 
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', 
    },
    // navHeader style removed
    // navTitle style removed
    // editButton style removed
    content: {
        padding: 24,
        paddingTop: 24, // Adjusted padding since header is gone
        paddingBottom: 40,
    },
    footerContainer: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 20,
    },
    signOutLink: {
        color: '#EF4444', // Red
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    versionText: {
        color: '#D1D5DB',
        fontSize: 12,
    }
});

export default ProfileScreen;
