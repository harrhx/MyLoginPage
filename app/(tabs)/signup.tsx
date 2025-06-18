import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { findUserByEmail, addUser } from './backend';
import { crossPlatformAlert } from './helpers';

const { width } = Dimensions.get('window');

const moderateScale = (size: number): number => {
    const newSize = size * (width / 375);
    return Math.round(newSize);
};

const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      crossPlatformAlert('Error', 'Please fill in all fields.');
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      crossPlatformAlert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      crossPlatformAlert('Error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        crossPlatformAlert('Account Exists', 'An account with this email already exists. Please log in.', [
            { text: 'OK', onPress: () => router.push('/login') }
        ]);
      } else {
        await addUser({ fullName, email, password });
        crossPlatformAlert('Sign Up Success', 'Your account has been created successfully. Please log in.', [
            { text: 'OK', onPress: () => router.push('/login') }
        ]);
      }
    } catch (error) {
        console.error('[SignUpScreen] An error occurred during sign up:', error);
        crossPlatformAlert('Error', 'An unexpected error occurred. Please try again.');
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
                        <Icon name="user-plus" size={moderateScale(50)} color="#007BFF" />
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join us and get started</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#888"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                        />
                        <TextInput
                            style={styles.input}
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
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Confirm Password"
                                placeholderTextColor="#888"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!isConfirmPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIconContainer}>
                                <Icon name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={moderateScale(18)} color="#888" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={[styles.loginText, styles.loginLink]}>Log In</Text>
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
  input: {
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
      marginBottom: 15,
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
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  loginText: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  loginLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
