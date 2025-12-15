import React from 'react';
import { AuthProvider } from './AuthContext';
import { HabitsProvider } from './HabitsContext';

import { OnboardingProvider } from './OnboardingContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <HabitsProvider>
          {children}
        </HabitsProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
};

export * from './AuthContext';
export * from './HabitsContext';
export * from './OnboardingContext';
