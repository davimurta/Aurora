import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Cadastro" />
        <Stack.Screen name="RedefinirSenha" />
        <Stack.Screen name="Home" />
        <Stack.Screen name="UserTypeSelection" />
      </Stack>
    </AuthProvider>
  );
}