import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    
      <Stack initialRouteName="home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
      </Stack>
  
  );
}