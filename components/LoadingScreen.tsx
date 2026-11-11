import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { C } from '../constants/theme';

export default function LoadingScreen({ message = 'Loading Scanimals...' }: { message?: string }) {
  return (
    <View style={s.container}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>🛡️</Text>
      <ActivityIndicator size="large" color={C.pri} />
      <Text style={s.text}>{message}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: C.ink2,
  },
});