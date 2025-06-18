import { Stack } from 'expo-router';
import React from 'react';

/**
 * This is the root layout for the app.
 * It sets up a Stack navigator, which is essential for a login flow.
 * Each <Stack.Screen /> corresponds to a file in the `app` directory.
 */
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The 'index' screen is the landing page. We hide the header for it. */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* The login screen will have a default header managed by the Stack. */}
      <Stack.Screen name="login" options={{ title: 'Log In' }} />

      {/* The sign-up screen. */}
      <Stack.Screen name="signup" options={{ title: 'Create Account' }} />

      {/* The home screen, shown after a successful login. */}
      <Stack.Screen name="home" options={{ title: 'Home', headerBackVisible: false }} />
    </Stack>
  );
}
