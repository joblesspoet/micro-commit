import React from 'react';
import { OnboardingTemplate } from '../../components/onboarding/OnboardingTemplate';
import { useNavigation } from '@react-navigation/native';

const Onboarding2Screen = () => {
    const navigation = useNavigation();

    return (
        <OnboardingTemplate
            title="Maximum 2 Minutes"
            description="Every habit must take 2 minutes or less. So small that you can't say no. So easy that you'll actually do it."
            image="⏱️"
            currentIndex={1}
            totalSteps={3}
            onNext={() => navigation.navigate('Onboarding3' as never)}
            onSkip={() => navigation.navigate('Login' as never)}
        />
    );
};

export default Onboarding2Screen;
