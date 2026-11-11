import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn, Field, Chip } from '../../components/UI';
import { C } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function AuthScreen() {
  const ins = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 👈 Loading state

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true); // 👈 Show loading screen
    setTimeout(async () => {
      const success = await login(email, password);
      setIsLoading(false); // 👈 Hide loading screen

      if (success) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password. Try sarah@scanimals.com / password123 or create a new account.');
      }
    }, 600); // Slight delay for smooth loading animation
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      const success = await login('sarah@scanimals.com', 'password123');
      setIsLoading(false);
      if (success) {
        router.replace('/(tabs)/home');
      }
    }, 600);
  };

  // Immersive Loading Screen Overlay
  if (isLoading) {
    return (
      <View style={[s.body, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={C.pri} />
        <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink, marginTop: 16 }}>Signing in to Scanimals...</Text>
        <Text style={{ fontSize: 13, color: C.ink2, marginTop: 4 }}>Loading your secure pet pass & community radar</Text>
      </View>
    );
  }

  return (
    <View style={[s.body, { paddingTop: ins.top + 30 }]}>
      <Chip t="🛡️ SafeNet Pet Protocol" />
      <Text style={s.h1}>Scanimals</Text>
      <Text style={s.sub}>Multi-account local database storage active.</Text>

      <View style={s.card}>
        <Text style={s.cardTitle}>Account Sign In</Text>
        
        <Field
          label="Email Address"
          placeholder="e.g. sarah@scanimals.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Field
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={s.forgotRow} onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={s.forgotTxt}>Forgot Password?</Text>
        </Pressable>

        <Btn kind="tint" t="Sign In" onPress={handleLogin} />

        <View style={s.divider} />

        <Btn kind="out" t="🚀 Quick Demo Login" onPress={handleDemoLogin} />
        <Btn kind="out" t="✨ Create New Account" onPress={() => router.replace('/(auth)/setup')} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  body: { padding: 20, gap: 14, backgroundColor: C.bg, flex: 1, justifyContent: 'center' },
  h1: { fontSize: 36, lineHeight: 42, fontWeight: '900', color: C.ink },
  sub: { fontSize: 14, lineHeight: 20, color: C.ink2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 24, padding: 20, gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: C.ink, marginBottom: 4 },
  forgotRow: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 6 },
  forgotTxt: { fontSize: 12, fontWeight: '700', color: C.pri },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 6 },
});