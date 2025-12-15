import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding1Screen from '../screens/onboarding/Onboarding1Screen';
import Onboarding2Screen from '../screens/onboarding/Onboarding2Screen';
import Onboarding3Screen from '../screens/onboarding/Onboarding3Screen';

const Stack = createNativeStackNavigator();

const OnboardingStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="Onboarding1" component={Onboarding1Screen} />
            <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
            <Stack.Screen name="Onboarding3" component={Onboarding3Screen} />
        </Stack.Navigator>
    );
};

export default OnboardingStack;
