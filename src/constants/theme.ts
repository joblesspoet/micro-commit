export const colors = {
  // Primary Colors
  primary: '#667eea',
  primaryDark: '#764ba2',
  
  // Status Colors
  success: '#48bb78',
  warning: '#f6ad55',
  danger: '#fc8181',
  
  // Neutral Colors
  background: '#f8f9fa',
  card: '#ffffff',
  textPrimary: '#2d3748',
  textSecondary: '#718096',
  border: '#e2e8f0',
  
  // Category Colors
  categories: {
    fitness: '#fc8181',
    learning: '#4299e1',
    mindfulness: '#9f7aea',
    productivity: '#48bb78',
    relationships: '#ed64a6',
  },
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
