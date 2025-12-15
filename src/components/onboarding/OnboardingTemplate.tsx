import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button } from '../common/Button';
import { PaginationDots } from './PaginationDots';
import { colors, typography } from '../../constants/theme';

interface OnboardingTemplateProps {
  title: string;
  description: string;
  image?: any; // Require source
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
}

// Update imports to include LinearGradient
import { LinearGradient } from 'expo-linear-gradient';

export const OnboardingTemplate: React.FC<OnboardingTemplateProps> = ({
  title,
  description,
  image,
  currentIndex,
  totalSteps,
  onNext,
  onSkip,
  nextLabel = 'Next'
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        {onSkip ? (
             <Button 
                title="Skip" 
                variant="outline" 
                onPress={onSkip} 
                style={styles.skipButton} 
                textStyle={{ fontSize: 16, fontWeight: '600', color: '#3b82f6' }}
                size="sm"
            />
        ) : (
            <View style={{ height: 36 }} /> // Spacer to keep layout processing
        )}
      </View>

      <View style={styles.content}>
        {image && (
          <View style={styles.imageContainer}>
             {/* If image is a string (emoji), render Text, else Image component */}
             {typeof image === 'string' && image.length < 5 ? (
                 <Text style={{ fontSize: 100 }}>{image}</Text>
             ) : (
                 <Image source={image} style={{ width: 200, height: 200 }} resizeMode="contain" />
             )}
          </View>
        )}
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.footer}>
        <PaginationDots total={totalSteps} currentIndex={currentIndex} />
        
        <TouchableOpacity onPress={onNext} activeOpacity={0.8} style={{ width: '100%' }}>
            <LinearGradient
                colors={['#3b82f6', '#8b5cf6']} // Blue to Purple gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
            >
                <Text style={styles.gradientButtonText}>{nextLabel}</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingTop: 12,
      height: 60,
      alignItems: 'center',
  },
  skipButton: {
      borderWidth: 0,
      paddingHorizontal: 0,
      height: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28, // Matches visual
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280', // Grey text
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  footer: {
    padding: 24,
    paddingBottom: 40, // More bottom padding
  },
  gradientButton: {
      width: '100%',
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
  },
  gradientButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
  }
});
