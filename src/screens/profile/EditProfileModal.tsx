import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../constants/theme';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    initialName: string;
    onSaveName: (name: string) => Promise<void>;
    onUploadImage: (uri: string) => Promise<void>;
    loading: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
    visible, 
    onClose, 
    initialName, 
    onSaveName, 
    onUploadImage,
    loading 
}) => {
    const [name, setName] = useState(initialName);
    const [tempImage, setTempImage] = useState<string | null>(null);

    // Reset state when opening
    React.useEffect(() => {
        if (visible) {
            setName(initialName);
            setTempImage(null);
        }
    }, [visible, initialName]);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setTempImage(result.assets[0].uri);
            // Optional: Upload immediately or wait for save?
            // Prompt implies specific upload function.
            // Let's upload immediately for avatar as is common, or wait for "Save"?
            // We'll wait for "Save" or provide a distinct button.
            // Simplified: "Upload" triggers the prop function immediately.
            onUploadImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (name !== initialName) {
            await onSaveName(name);
        }
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Profile</Text>
                        <TouchableOpacity onPress={onClose} disabled={loading}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Avatar Upload */}
                    <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={handlePickImage} style={styles.uploadButton}>
                            <Ionicons name="camera" size={24} color={colors.primary} />
                            <Text style={styles.uploadText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Name Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Display Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your Name"
                            maxLength={50}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity 
                        style={[styles.saveButton, loading && styles.disabledButton]} 
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: '50%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
    },
    uploadText: {
        marginLeft: 8,
        color: colors.primary,
        fontWeight: '600',
    },
    inputContainer: {
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#111827',
        backgroundColor: '#F9FAFB',
    },
    saveButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
