import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingOption {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    iconBgColor: string;
    label: string;
    value?: string;
    onPress: () => void;
    isDestructive?: boolean;
}

interface SettingsListProps {
    options: SettingOption[];
}

export const SettingsList: React.FC<SettingsListProps> = ({ options }) => {
    return (
        <View style={styles.container}>
            {options.map((option, index) => (
                <TouchableOpacity 
                    key={option.id} 
                    style={[styles.item, index !== options.length - 1 && styles.borderBottom]}
                    onPress={option.onPress}
                    activeOpacity={0.7}
                >
                    <View style={styles.left}>
                        <View style={[styles.iconContainer, { backgroundColor: option.iconBgColor }]}>
                            <Ionicons name={option.icon} size={20} color={option.iconColor} />
                        </View>
                        <Text style={[styles.label, option.isDestructive && styles.destructiveText]}>
                            {option.label}
                        </Text>
                    </View>
                    
                    <View style={styles.right}>
                        {option.value && (
                            <Text style={styles.value}>{option.value}</Text>
                        )}
                        <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
      backgroundColor: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 24,
  },
  item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#fff',
  },
  borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: '#F9FAFB',
  },
  left: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
  },
  label: {
      fontSize: 16,
      fontWeight: '500',
      color: '#111827',
  },
  destructiveText: {
      color: '#EF4444',
  },
  right: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  value: {
      fontSize: 14,
      color: '#9CA3AF',
      marginRight: 8,
  },
});
