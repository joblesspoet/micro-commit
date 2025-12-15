import React from 'react';
import { OnboardingTemplate } from '../../components/onboarding/OnboardingTemplate';
import { useNavigation } from '@react-navigation/native';
import { useOnboarding } from '../../context/OnboardingContext';

const Onboarding3Screen = () => {
    const navigation = useNavigation();
    const { completeOnboarding } = useOnboarding();

    const handleFinish = async () => {
        await completeOnboarding();
        // Context Update will trigger AppNavigator to switch stacks to Auth
    };

    return (
        <OnboardingTemplate
            title="Build Your Streak"
            description="Consistency beats intensity. Do 2 squats every day for a year = 730 squats you wouldn't have done."
            image="🔥"
            currentIndex={2}
            totalSteps={3}
            onNext={handleFinish}
            nextLabel="Get Started"
        />
    );
};

export default Onboarding3Screen;
