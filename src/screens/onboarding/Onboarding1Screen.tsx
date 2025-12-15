import React from 'react';
import { OnboardingTemplate } from '../../components/onboarding/OnboardingTemplate';
import { useNavigation } from '@react-navigation/native';

const Onboarding1Screen = () => {
    const navigation = useNavigation();

    return (
        <OnboardingTemplate
            title="Start Tiny, Win Big"
            description="Most people fail at habits because they start too big. We force you to start ridiculously small."
            image="🐣"
            currentIndex={0}
            totalSteps={3}
            onNext={() => navigation.navigate('Onboarding2' as never)}
            onSkip={() => navigation.navigate('Login' as never)}
        />
    );
};

export default Onboarding1Screen;
