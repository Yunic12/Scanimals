import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from '../context/AppContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { C } from '../constants/theme';
import StateInspector from '../components/StateInspector'; // 👈 Import state inspector

function RootNav() {
  const { loading, isAuthenticated } = useApp();

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={C.pri} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="finder-view" />
          <Stack.Screen name="showcase" />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <RootNav />
      <StateInspector /> {/* 👈 Renders live state inspector globally */}
    </AppProvider>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg },
});