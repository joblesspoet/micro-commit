import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { CategoryIcon } from '../../components/habits/CategoryIcon';
import { useHabits } from '../../hooks/useHabits';
import { validateHabitName, validateDuration } from '../../utils/validation';
import { CATEGORIES } from '../../constants/categories';
import { colors, typography } from '../../constants/theme';
import { MainStackParamList } from '../../types';

type EditHabitRouteProp = RouteProp<MainStackParamList, 'EditHabit'>;

const EditHabitScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<EditHabitRouteProp>();
    const { habitId } = route.params;
    const { habits, updateHabit, deleteHabit } = useHabits();
    
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
            setName(habit.name);
            setDuration(habit.duration_seconds.toString());
            setCategory(habit.category);
        }
    }, [habitId, habits]);

    const handleUpdate = async () => {
        if (!validateHabitName(name)) {
            Alert.alert('Error', 'Habit name must be between 3 and 50 characters');
            return;
        }
        
        const dur = parseInt(duration);
        if (isNaN(dur) || !validateDuration(dur)) {
            Alert.alert('Error', 'Duration must be between 1 and 120 seconds');
            return;
        }

        setIsLoading(true);
        try {
            await updateHabit(habitId, {
                name,
                duration_seconds: dur,
                category: category as any,
                color: CATEGORIES.find(c => c.id === category)?.color || colors.primary,
            });
            Alert.alert('Success', 'Habit updated!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update habit');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'Delete', 
                style: 'destructive', 
                onPress: async () => {
                    setIsLoading(true);
                    try {
                        await deleteHabit(habitId);
                        navigation.goBack();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete habit');
                    } finally {
                        setIsLoading(false);
                    }
                }
            }
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Edit Micro-Habit</Text>
                
                <Input
                    label="What is your tiny habit?"
                    placeholder="e.g., Do 2 pushups"
                    value={name}
                    onChangeText={setName}
                />

                <Input
                    label="Duration (seconds)"
                    placeholder="Max 120"
                    value={duration}
                    onChangeText={setDuration}
                    keyboardType="numeric"
                />
                
                <Text style={styles.label}>Category</Text>
                <View style={styles.categories}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity 
                            key={cat.id} 
                            style={[
                                styles.categoryItem, 
                                category === cat.id && styles.activeCategory,
                                { borderColor: cat.color }
                            ]}
                            onPress={() => setCategory(cat.id)}
                        >
                            <CategoryIcon category={cat.id} size={32} showBackground={false} />
                            <Text style={[
                                styles.categoryName,
                                category === cat.id && { color: cat.color, fontWeight: 'bold' }
                            ]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Button 
                    title="Save Changes" 
                    onPress={handleUpdate} 
                    isLoading={isLoading}
                    style={{ marginTop: 24 }}
                />
                
                <Button 
                    title="Delete Habit" 
                    variant="danger"
                    onPress={handleDelete} 
                    disabled={isLoading}
                    style={{ marginTop: 12 }}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: typography.sizes['2xl'],
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 24,
    },
    label: {
        fontSize: typography.sizes.sm,
        color: colors.textPrimary,
        marginBottom: 8,
        fontWeight: '500',
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    categoryItem: {
        width: '30%',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        marginRight: '3%',
        marginBottom: 12,
    },
    activeCategory: {
        backgroundColor: colors.background,
        borderWidth: 2,
    },
    categoryName: {
        fontSize: 12,
        marginTop: 4,
        color: colors.textSecondary,
    }
});

export default EditHabitScreen;
