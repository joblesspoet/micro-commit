import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../constants/theme';

const SplashScreen = () => {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.Text 
        style={[styles.logo, { transform: [{ scale: bounceAnim }] }]}
      >
        🎯
      </Animated.Text>
      <Text style={styles.appName}>Micro-Commit</Text>
      <Text style={styles.tagline}>Start ridiculously small</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
    color: '#ffffff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: typography.sizes.lg,
    color: '#ffffff',
    opacity: 0.9,
  },
});

export default SplashScreen;
