import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Btn, Chip } from '../components/UI';
import { C } from '../constants/theme';

export default function ShowcaseScreen() {
  const ins = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={[s.body, { paddingTop: ins.top + 16 }]}>
      <Chip t="🛠️ Developer Showcase Hub" />
      <Text style={s.h1}>Architecture & Features</Text>
      <Text style={s.sub}>Summary of technical implementations built for Scanimals.</Text>

      <View style={s.card}>
        <Text style={s.h2}>Tech Stack & Libraries</Text>
        <Text style={s.desc}>• Expo SDK 54 & expo-router for file-based routing.</Text>
        <Text style={s.desc}>• AsyncStorage for local persistence of owner profile and pets.</Text>
        <Text style={s.desc}>• react-native-svg for dynamic QR badge rendering.</Text>
      </View>

      <View style={s.card}>
        <Text style={s.h2}>Core Modules</Text>
        <Text style={s.desc}>1. Auth & Password Recovery Flow</Text>
        <Text style={s.desc}>2. Owner Onboarding Modal & Greeting Splash</Text>
        <Text style={s.desc}>3. Home Dashboard with multi-pet support</Text>
        <Text style={s.desc}>4. TikTok-style Vertical Social Clip Feed</Text>
        <Text style={s.desc}>5. Community Lost Beacons & Sighting Radar</Text>
      </View>

      <Btn kind="tint" t="← Return to Home" onPress={() => router.replace('/(tabs)/home')} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  body: { padding: 16, gap: 14, backgroundColor: C.bg, flexGrow: 1 },
  h1: { fontSize: 26, fontWeight: '800', color: C.ink },
  h2: { fontSize: 18, fontWeight: '700', color: C.ink },
  sub: { fontSize: 14, color: C.ink2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 20, padding: 16, gap: 8 },
  desc: { fontSize: 13, color: C.ink2, lineHeight: 18 },
});