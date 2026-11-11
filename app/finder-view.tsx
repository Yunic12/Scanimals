import React from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { Btn, Chip } from '../components/UI';
import { C } from '../constants/theme';

export default function FinderViewScreen() {
  const ins = useSafeAreaInsets();
  const router = useRouter();
  const { activePet, owner, lost } = useApp();

  const handleContact = () => {
    Alert.alert('Ping Sent!', 'An automated GPS location alert has been securely transmitted to the owner.');
  };

  if (!activePet) return null;

  return (
    <ScrollView contentContainerStyle={[s.body, { paddingTop: ins.top + 16 }]}>
      <Chip t="👀 Public Finder View Simulator" />
      <Text style={s.h1}>Found this pet?</Text>
      <Text style={s.sub}>You scanned a secure Scanimals QR tag. Here is how you can help get {activePet.name} home.</Text>

      <View style={[s.card, lost && { borderColor: C.red, backgroundColor: C.redBg }]}>
        <View style={s.rowCenter}>
          <Text style={{ fontSize: 44 }}>{activePet.emo}</Text>
          <View style={{ gap: 2 }}>
            <Text style={s.name}>{activePet.name}</Text>
            <Text style={s.sub}>{activePet.breed} • {activePet.species}</Text>
          </View>
        </View>

        <View style={s.divider} />

        <View style={{ gap: 6 }}>
          <Text style={s.label}>OWNER CONTACT</Text>
          <Text style={s.val}>{owner?.name || 'Owner'}</Text>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={s.label}>MICROCHIP ID</Text>
          <Text style={s.val}>{activePet.chip}</Text>
        </View>

        {activePet.allergy ? (
          <View style={{ gap: 6 }}>
            <Text style={s.label}>MEDICAL NOTE</Text>
            <Text style={[s.val, { color: C.redInk }]}>{activePet.allergy}</Text>
          </View>
        ) : null}

        <Btn kind="tint" t="📍 Send My Location to Owner" onPress={handleContact} />
      </View>

      <Btn kind="out" t="← Back to Dashboard" onPress={() => router.back()} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  body: { padding: 16, gap: 14, backgroundColor: C.bg, flexGrow: 1 },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: '800', color: C.ink },
  sub: { fontSize: 14, lineHeight: 20, color: C.ink2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 24, padding: 18, gap: 14 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  name: { fontSize: 22, fontWeight: '800', color: C.ink },
  divider: { height: 1, backgroundColor: C.line },
  label: { fontSize: 10, fontWeight: '700', color: C.ink2, letterSpacing: 0.5 },
  val: { fontSize: 15, fontWeight: '700', color: C.ink },
});