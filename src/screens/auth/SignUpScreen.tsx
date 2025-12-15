import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validation';
import { colors, typography } from '../../constants/theme';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Google Logo URL or local asset
  // For Expo Image we might need a png if svgs aren't setup, let's use a text G with colors for now or a reliable CDN png 
  const googleLogoPng = "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png";

  const handleSignUp = async () => {
    // 1. Validate Display Name
    const name = displayName.trim();
    if (!name) {
        Alert.alert('Error', 'Please enter your name');
        return;
    }
    if (name.length < 2) {
        Alert.alert('Error', 'Name must be at least 2 characters');
        return;
    }
    
    // 2. Validate Email
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // 3. Validate Password
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (!/\d/.test(password)) {
        Alert.alert('Error', 'Password must contain at least 1 number');
        return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name);
      // Success handled by AuthProvider/Navigation usually, but if email confirm needed:
      Alert.alert('Success', 'Account created! Please check your email to verify.', [
          { text: 'OK', onPress: () => navigation.navigate('Login' as never) }
      ]);
    } catch (error: any) {
      // Map Supabase errors to user friendly messages if needed
      let msg = error.message || 'Something went wrong. Please try again.';
      if (msg.includes('already registered')) msg = 'This email is already registered. Please login instead.';
      if (msg.includes('network')) msg = 'No internet connection. Please check your network.';
      
      Alert.alert('Sign Up Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your micro-habit journey today.</Text>
        </View>

        <View style={styles.card}>
            <View style={styles.form}>
            <Input
                label="Full Name"
                placeholder="John Doe"
                value={displayName}
                onChangeText={setDisplayName}
                containerStyle={{ marginBottom: 20 }}
            />
            <Input
                label="Email"
                placeholder="user@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={{ marginBottom: 20 }}
            />
            <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                rightIcon={
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Text style={{ color: colors.textSecondary, fontSize: 18 }}>
                        {isPasswordVisible ? '👁️' : '🚫'} 
                        </Text>
                    </TouchableOpacity>
                }
                containerStyle={{ marginBottom: 24 }}
            />

            <Button 
                title="Sign Up" 
                onPress={handleSignUp} 
                isLoading={isLoading}
                style={styles.signupButton}
            />
            </View>

            <View style={styles.footer}>
                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>or</Text>
                    <View style={styles.line} />
                </View>
                
                <TouchableOpacity 
                    style={styles.googleButton}
                    onPress={() => Alert.alert('Coming Soon', 'Google Signup not implemented in this demo')}
                    activeOpacity={0.8}
                >
                    <Image 
                            source={{ uri: googleLogoPng }} 
                            style={{ width: 24, height: 24, marginRight: 12 }} 
                            resizeMode="contain"
                        />
                    <Text style={styles.googleButtonText}>Sign up with Google</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light grey background
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
  },
  form: {
    marginBottom: 24,
  },
  signupButton: {
      backgroundColor: '#3B82F6', // Blue 500
      height: 52,
      borderRadius: 26,
  },
  footer: {
      marginTop: 0
  },
  divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
  },
  line: {
      flex: 1,
      height: 1,
      backgroundColor: '#E5E7EB',
  },
  orText: {
      marginHorizontal: 16,
      color: '#9CA3AF',
      fontSize: 14,
  },
  googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 52,
      borderRadius: 26,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#fff',
  },
  googleButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
  },
  loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
  },
  loginText: {
      color: '#6B7280',
      fontSize: 14,
  },
  loginLink: {
      color: '#3B82F6',
      fontWeight: '600',
      fontSize: 14,
  }
});

export default SignUpScreen;
