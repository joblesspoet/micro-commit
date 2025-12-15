import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useOnboarding } from '../context/OnboardingContext';
import SplashScreen from '../screens/SplashScreen';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import OnboardingStack from './OnboardingStack';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { user, isLoading: authLoading } = useAuth();
    const { hasOnboarded, isLoading: onboardingLoading } = useOnboarding();
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    useEffect(() => {
        // Simulate splash delay if needed, but we can rely on isLoading from auth
        // Or specific splash logic
        setTimeout(() => setIsSplashVisible(false), 2000);
    }, []);

    if (authLoading || onboardingLoading || isSplashVisible) {
        return (
            <NavigationContainer>
                 <SplashScreen />
            </NavigationContainer>
        );  
         // Note: Normally Splash is a screen in the navigator.
         // But here we can render it directly while loading state is true.
         // Or use a Stack.Screen.
         // The prompt provided SplashScreen.tsx as a screen that navigates.
         // Integration strategy: 
         // If we use the provided SplashScreen component which has internal navigation logic,
         // we need it inside a navigator. 
         // But 'AppNavigator' usually controls the state.
         
         // Let's use the standard "Auth Loading" pattern where we show Splash until we know state.
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Main" component={MainStack} />
                ) : (
                    !hasOnboarded ? (
                         <Stack.Screen name="Onboarding" component={OnboardingStack} />
                    ) : (
                         <Stack.Screen name="Auth" component={AuthStack} />
                    )
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
