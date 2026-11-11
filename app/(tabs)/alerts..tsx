import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, Pet } from '../../context/AppContext';
import { Chip, Btn } from '../../components/UI';
import { C } from '../../constants/theme';

interface LostReport {
  id: string;
  petName: string;
  ownerName: string;
  emoji: string;
  location: string;
  time: string;
  microchip: string;
}

const COMMUNITY_LOST_PETS: LostReport[] = [
  {
    id: '1',
    petName: 'Luna',
    ownerName: 'Mark R.',
    emoji: '🐈',
    location: 'Sector 4 Backyards',
    time: '2 hours ago',
    microchip: '985112009988',
  },
  {
    id: '2',
    petName: 'Rocky',
    ownerName: 'Dave P.',
    emoji: '🐕',
    location: 'Main Plaza & Fountain',
    time: '5 hours ago',
    microchip: '985112334411',
  },
];

export default function AlertsScreen() {
  const ins = useSafeAreaInsets();
  const { lost, setLost, pets } = useApp();
  
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedPetForAlert, setSelectedPetForAlert] = useState<Pet | null>(null);

  const handleNotifyOwner = (petName: string, ownerName: string) => {
    Alert.alert(
      'Sighting Transmitted! 📍',
      `Your current GPS ping and contact link have been sent directly to ${ownerName} for ${petName}.`
    );
  };

  const confirmBroadcast = (pet: Pet) => {
    setSelectedPetForAlert(pet);
    setShowSelectModal(false);
    setLost(true);
  };

  return (
    <ScrollView contentContainerStyle={[s.body, { paddingTop: ins.top + 16 }]}>
      <View style={s.rowBetween}>
        <View>
          <Text style={s.sub}>Community Radar</Text>
          <Text style={s.h1}>Lost Pet Alerts</Text>
        </View>
        <Chip t={lost ? '🚨 My Beacon Active' : '🟢 Radar Clear'} red={lost} />
      </View>

      {/* User's Lost Status Manager & Pet Selector Trigger */}
      {lost ? (
        <View style={s.activeCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 36 }}>{selectedPetForAlert?.emo || pets[0]?.emo || '🐾'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.activeHeader}>⚠️ {selectedPetForAlert?.name.toUpperCase() || 'YOUR PET'} IS MARKED LOST</Text>
              <Text style={s.subText}>SafeNet tag is broadcasting emergency scan beacons to nearby users.</Text>
            </View>
          </View>
          <Btn kind="tint" t="Mark My Pet Safe & Cancel Beacon" onPress={() => setLost(false)} />
        </View>
      ) : (
        <View style={s.card}>
          <Text style={s.h2}>Lost My Pet?</Text>
          <Text style={s.subText}>Select which registered pet you want to broadcast an emergency alert for.</Text>
          <Btn kind="red" t="🚨 Broadcast Emergency Lost Alert" onPress={() => setShowSelectModal(true)} />
        </View>
      )}

      <Text style={s.h2}>Active Lost Beacons in Your Area</Text>

      {COMMUNITY_LOST_PETS.map((item) => (
        <View key={item.id} style={s.beaconCard}>
          <View style={s.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {/* Fixed missing icon display */}
              <View style={s.iconBox}>
                <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
              </View>
              <View>
                <Text style={s.beaconName}>{item.petName}</Text>
                <Text style={s.beaconSub}>Owner: {item.ownerName}</Text>
              </View>
            </View>
            <Chip t="🚨 LOST" red />
          </View>

          <View style={s.divider} />

          <Text style={s.infoTxt}>📍 Last Seen: <Text style={s.bold}>{item.location}</Text></Text>
          <Text style={s.infoTxt}>🕒 Time: <Text style={s.bold}>{item.time}</Text></Text>
          <Text style={s.infoTxt}>🏷️ Microchip: <Text style={s.bold}>{item.microchip}</Text></Text>

          <Btn
            kind="tint"
            t={`📍 I See ${item.petName}! Notify Owner`}
            onPress={() => handleNotifyOwner(item.petName, item.ownerName)}
          />
        </View>
      ))}

      {/* Pet Selection Modal for Lost Broadcast */}
      <Modal visible={showSelectModal} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.rowBetween}>
              <Text style={s.h2}>Select Missing Pet</Text>
              <Pressable onPress={() => setShowSelectModal(false)}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>✕</Text>
              </Pressable>
            </View>
            <Text style={s.subText}>Choose which of your registered pets you want to declare missing on the community radar:</Text>

            <View style={{ gap: 8, marginVertical: 4 }}>
              {pets.map((p) => (
                <Pressable key={p.id} style={s.petSelectItem} onPress={() => confirmBroadcast(p)}>
                  <Text style={{ fontSize: 28 }}>{p.emo}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.petSelectName}>{p.name}</Text>
                    <Text style={s.petSelectSub}>{p.breed} • Microchip: {p.chip}</Text>
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: C.red }}>Select 🚨</Text>
                </Pressable>
              ))}
            </View>

            <Btn kind="out" t="Cancel" onPress={() => setShowSelectModal(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  body: { padding: 16, gap: 14, backgroundColor: C.bg, flexGrow: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h1: { fontSize: 26, fontWeight: '800', color: C.ink },
  h2: { fontSize: 18, fontWeight: '700', color: C.ink },
  sub: { fontSize: 14, color: C.ink2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 20, padding: 16, gap: 8 },
  activeCard: { backgroundColor: C.redBg, borderWidth: 2, borderColor: C.red, borderRadius: 20, padding: 16, gap: 12 },
  activeHeader: { color: C.redInk, fontWeight: '800', fontSize: 12 },
  subText: { fontSize: 13, color: C.ink2, lineHeight: 18 },
  beaconCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 20, padding: 16, gap: 10 },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.field, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.line },
  beaconName: { fontSize: 18, fontWeight: '800', color: C.ink },
  beaconSub: { fontSize: 12, color: C.ink2 },
  divider: { height: 1, backgroundColor: C.line },
  infoTxt: { fontSize: 12, color: C.ink },
  bold: { fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: C.card, borderRadius: 24, padding: 20, gap: 12 },
  petSelectItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: C.line, backgroundColor: C.field },
  petSelectName: { fontSize: 15, fontWeight: '800', color: C.ink },
  petSelectSub: { fontSize: 11, color: C.ink2 },
});