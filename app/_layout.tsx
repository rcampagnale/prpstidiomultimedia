import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack initialRouteName="homeVisitante" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="homeVisitante" />
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="quienesSomos" />
    </Stack>
  );
}

