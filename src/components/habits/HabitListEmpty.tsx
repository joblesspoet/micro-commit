import React from 'react';
import { EmptyState } from '../common/EmptyState';

export const HabitListEmpty = () => (
  <EmptyState
    icon="🌱"
    title="No habits yet"
    description="Start small! Add your first micro-habit to begin your journey."
  />
);
