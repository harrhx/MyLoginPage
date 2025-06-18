import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { findUserByEmail } from './backend';
import { crossPlatformAlert } from './helpers';

const { width } = Dimensions.get('window');

const moderateScale = (size: number): number => {
    const newSize = size * (width / 375);
    return Math.round(newSize);
};

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      crossPlatformAlert('Error', 'Please enter both email and password.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      crossPlatformAlert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await findUserByEmail(email);

      if (!user) {
        crossPlatformAlert('Login Failed', 'No account found with this email. Please sign up.', [
          { text: 'OK', onPress: () => router.push('/signup') }
        ]);
        return;
      }
      
      if (user.passwordHash !== password) {
        crossPlatformAlert('Login Failed', 'Incorrect password. Please try again.');
        return;
      }

      crossPlatformAlert('Login Success', `Welcome back, ${user.fullName}!`);
      router.push({ pathname: '/home', params: { userEmail: user.email } });

    } catch (error) {
      console.error('[LoginScreen] An error occurred during login:', error);
      crossPlatformAlert('Error', 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Icon name="anchor" size={moderateScale(50)} color="#007BFF" />
                        <Text style={styles.title}>Log In Now</Text>
                        <Text style={styles.subtitle}>Please login to continue using our app</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="Email"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                placeholderTextColor="#888"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIconContainer}>
                                <Icon name={isPasswordVisible ? "eye-off" : "eye"} size={moderateScale(18)} color="#888" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => { /* Forgot Password Logic */ }}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
                    </TouchableOpacity>

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/signup')}>
                            <Text style={[styles.signupText, styles.signupLink]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: '#666',
    marginTop: 8,
  },
  inputContainer: {
    width: '100%',
  },
  emailInput: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 15,
    fontSize: moderateScale(14),
    color: '#333',
    marginBottom: 15,
  },
  passwordWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#f2f2f2',
      borderRadius: 10,
  },
  passwordInput: {
      flex: 1,
      padding: 15,
      fontSize: moderateScale(14),
      color: '#333',
  },
  eyeIconContainer: {
      padding: 15,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontSize: moderateScale(13),
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  signupText: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  signupLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
