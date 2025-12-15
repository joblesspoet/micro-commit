import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validation';
import { colors, typography } from '../../constants/theme';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Google Logo URL or local asset
  const googleLogo = "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"; 
  // For Expo Image we might need a png if svgs aren't setup, let's use a text G with colors for now or a reliable CDN png 
  const googleLogoPng = "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png";

  const handleLogin = async () => {
    // 1. Validate inputs
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      let msg = error.message || 'Something went wrong';
      
      // Map Errors
      if (msg.includes('Too many failed attempts')) {
          msg = 'Too many failed attempts. Please try again in 15 minutes.';
      } else if (msg.includes('Invalid login credentials')) {
          msg = 'Invalid email or password';
      } else if (msg.includes('Email not confirmed')) {
          msg = 'Please verify your email before logging in';
      } else if (msg.includes('network')) {
          msg = 'Connection failed. Please check your internet.';
      }
      
      Alert.alert('Login Failed', msg);
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Let's keep the streak alive.</Text>
        </View>

        <View style={styles.card}>
            <View style={styles.form}>
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
                           {/* Using emoji for now as we don't have icon set, 
                               standard crossed eye usually implies "hidden" but often the icon is "show/hide".
                               Design shows an eye with a slash (hidden) when dot are visible.
                           */}
                        </Text>
                    </TouchableOpacity>
                }
                containerStyle={{ marginBottom: 12 }}
              />
              
              <TouchableOpacity 
                onPress={() => navigation.navigate('ForgotPassword' as never)}
                style={{ alignSelf: 'flex-end', marginBottom: 24 }}
              >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button 
                title="Log In" 
                onPress={handleLogin} 
                isLoading={isLoading} 
                style={styles.loginButton}
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
                onPress={() => Alert.alert('Coming Soon', 'Google Login not implemented in this demo')}
                activeOpacity={0.8}
              >
                   <Image 
                        source={{ uri: googleLogoPng }} 
                        style={{ width: 24, height: 24, marginRight: 12 }} 
                        resizeMode="contain"
                    />
                   <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>
        </View>

        <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
                <Text style={styles.signupLink}>Sign Up</Text>
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
    fontSize: 28, // Matches visual
    fontWeight: 'bold',
    color: '#111827', // Darker black
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280', // Grey 500
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
  forgotPasswordText: {
      color: '#3B82F6', // Blue 500
      fontSize: 14,
      fontWeight: '500',
  },
  loginButton: {
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
      backgroundColor: '#E5E7EB', // Grey 200
  },
  orText: {
      marginHorizontal: 16,
      color: '#9CA3AF', // Grey 400
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
      color: '#374151', // Grey 700
  },
  signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
  },
  signupText: {
      color: '#6B7280',
      fontSize: 14,
  },
  signupLink: {
      color: '#3B82F6',
      fontWeight: '600',
      fontSize: 14,
  }
});

export default LoginScreen;
