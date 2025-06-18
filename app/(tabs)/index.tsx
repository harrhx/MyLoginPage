import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');
const moderateScale = (size: number) => Math.round(size * (width / 375));

const LandingScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="anchor" size={moderateScale(80)} color="#007BFF" />
        <Text style={styles.title}>Welcome To Your App</Text>
        <Text style={styles.subtitle}>Create an account and access thousands of cool stuffs</Text>
      </View>

      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.signupButton]} 
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.07,
  },
  header: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
    maxWidth: '80%',
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: '#28A745',
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});

export default LandingScreen;
