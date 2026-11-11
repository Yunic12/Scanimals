import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn, Field, Chip } from '../../components/UI';
import { C } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const ins = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleResetRequest = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address associated with your Scanimals account.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <View style={[s.body, { paddingTop: ins.top + 20 }]}>
      <View style={s.topRow}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backTxt}>← Back</Text>
        </Pressable>
        <Chip t="🔑 Password Recovery" />
      </View>

      <Text style={s.h1}>Forgot Password?</Text>
      <Text style={s.sub}>
        Enter your registered email address below and we'll send you instructions to reset your account credentials.
      </Text>

      {submitted ? (
        <View style={s.successCard}>
          <Text style={{ fontSize: 40 }}>📧</Text>
          <Text style={s.successTitle}>Reset Link Sent!</Text>
          <Text style={s.successSub}>
            We have sent password recovery instructions to <Text style={{ fontWeight: '700' }}>{email}</Text>. Please check your inbox.
          </Text>
          <Btn kind="tint" t="Return to Login" onPress={() => router.replace('/(auth)')} />
        </View>
      ) : (
        <View style={s.card}>
          <Field
            label="Registered Email Address"
            placeholder="e.g. owner@scanimals.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Btn kind="tint" t="Send Reset Link" onPress={handleResetRequest} />
          <Pressable style={s.demoLink} onPress={() => router.replace('/(tabs)/home')}>
            <Text style={s.demoTxt}>Bypass & Enter Demo Mode →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  body: { padding: 20, gap: 16, backgroundColor: C.bg, flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  backTxt: { fontSize: 13, fontWeight: '700', color: C.ink },
  h1: { fontSize: 30, fontWeight: '900', color: C.ink },
  sub: { fontSize: 14, lineHeight: 20, color: C.ink2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 24, padding: 20, gap: 14, marginTop: 10 },
  successCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 24, padding: 24, gap: 12, alignItems: 'center', marginTop: 10 },
  successTitle: { fontSize: 20, fontWeight: '800', color: C.ink },
  successSub: { fontSize: 13, color: C.ink2, textAlign: 'center', lineHeight: 18 },
  demoLink: { alignItems: 'center', marginTop: 6 },
  demoTxt: { fontSize: 12, fontWeight: '700', color: C.pri },
});