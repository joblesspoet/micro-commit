import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AddHabitScreen from '../screens/habits/AddHabitScreen';
import EditHabitScreen from '../screens/habits/EditHabitScreen';
import HabitCheckinScreen from '../screens/habits/HabitCheckinScreen';
import HabitSuccessScreen from '../screens/habits/HabitSuccessScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { MainStackParamList } from '../types';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerTintColor: colors.primary,
                headerBackTitleVisible: false,
                contentStyle: { backgroundColor: '#fff' }
            }}
        >
            <Stack.Screen 
                name="Dashboard" 
                component={DashboardScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="AddHabit" 
                component={AddHabitScreen} 
                options={{ presentation: 'modal', headerShown: false }} 
            />
            <Stack.Screen 
                name="EditHabit" 
                component={EditHabitScreen} 
                options={{ title: 'Edit Habit' }} 
            />
            <Stack.Screen 
                name="HabitCheckin" 
                component={HabitCheckinScreen} 
                options={{ title: '', headerTransparent: true }} 
            />
            <Stack.Screen 
                name="HabitSuccess" 
                component={HabitSuccessScreen} 
                options={{ headerShown: false, gestureEnabled: false }} 
            />
            <Stack.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ title: 'Profile' }} 
            />
        </Stack.Navigator>
    );
};

export default MainStack;
