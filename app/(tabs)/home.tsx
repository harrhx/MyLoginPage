import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userEmail } = params;

  const handleLogout = () => {
    router.push('/'); // Navigate back to the landing page
  };

  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={80} color="#28A745" />
      <Text style={styles.title}>Login Successful!</Text>
      <Text style={styles.subtitle}>Welcome back,</Text>
      <Text style={styles.emailText}>{userEmail}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  emailText: {
    fontSize: 18,
    color: '#007BFF',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 40,
  },
  logoutButton: {
      backgroundColor: '#DC3545',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
  },
  logoutButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  }
});

export default HomeScreen;
