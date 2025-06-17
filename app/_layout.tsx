// app/layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="homeVisitante"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="homeVisitante" />
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="quienesSomos" />
      <Stack.Screen name="contacto" />
      <Stack.Screen name="registrarse" />
      <Stack.Screen name="datosPersonales" />
      {/* Pantalla dinámica para videos */}
      <Stack.Screen name="watch/[videoOld]" options={{ title: 'Video' }} />
      {/* Agrega aquí más pantallas si las necesitas */}
    </Stack>
  );
}


