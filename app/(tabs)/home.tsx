import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import Pass from '../../components/Pass';
import { Btn, Chip, Field } from '../../components/UI';
import OnboardingModal from '../../components/OnboardingModal';
import { C } from '../../constants/theme';

export default function HomeScreen() {
  const ins = useSafeAreaInsets();
  const router = useRouter();
  const { owner, pets, activePet, lost, setLost, addPet, logout } = useApp();
  const [showEditOwner, setShowEditOwner] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);

  // New Pet Form State
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [chip, setChip] = useState('');
  const [emoji, setEmoji] = useState('🐕');

  const handleAddPetSubmit = async () => {
    if (!petName.trim()) return;
    await addPet({
      name: petName,
      emo: emoji,
      species,
      breed: breed || 'Mixed Breed',
      allergy: 'None',
      chip: chip || Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      vax: true,
    });
    setPetName('');
    setBreed('');
    setChip('');
    setShowAddPet(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)');
  };

  return (
    <ScrollView contentContainerStyle={[s.body, { paddingTop: ins.top + 16 }]}>
      {/* Header */}
      <View style={s.rowBetween}>
        <View>
          <Text style={s.sub}>Scanimals Home</Text>
          <Text style={s.h1}>{owner?.name || 'Pet Owner'}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Pressable onPress={() => setShowEditOwner(true)}>
            <Chip t={lost ? '🚨 LOST MODE' : '🟢 SAFE'} red={lost} />
          </Pressable>
        </View>
      </View>

      {/* Owner Detail Banner */}
      <View style={s.ownerCard}>
        <View style={s.rowBetween}>
          <Text style={s.ownerTitle}>Owner Identity</Text>
          <Pressable onPress={() => setShowEditOwner(true)}>
            <Text style={s.editLink}>Edit Info ✏️</Text>
          </Pressable>
        </View>
        <View style={s.ownerGrid}>
          <Text style={s.ownerDetail}>Age: <Text style={s.bold}>{owner?.age || '26'}</Text></Text>
          <Text style={s.ownerDetail}>Sex: <Text style={s.bold}>{owner?.sex || 'Female'}</Text></Text>
          <Text style={s.ownerDetail}>DOB: <Text style={s.bold}>{owner?.birthday || '1998-05-14'}</Text></Text>
          <Text style={s.ownerDetail}>My Posts: <Text style={s.bold}>3 Clips</Text></Text>
        </View>
      </View>

      {/* Active Digital Pet Pass */}
      {activePet ? <Pass p={{ ...activePet, owner: owner?.name || 'Owner' }} /> : null}

      {/* Registered Pets Row */}
      <View style={s.rowBetween}>
        <Text style={s.h2}>Registered Pets ({pets.length})</Text>
        <Pressable style={s.addPetBtn} onPress={() => setShowAddPet(true)}>
          <Text style={s.addPetTxt}>+ Add Pet</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {pets.map((p) => (
          <View key={p.id} style={s.petChipCard}>
            <Text style={{ fontSize: 24 }}>{p.emo}</Text>
            <View>
              <Text style={s.petChipName}>{p.name}</Text>
              <Text style={s.petChipSub}>{p.breed}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Lost / Safety Status Toggle */}
      {lost ? (
        <View style={s.lostCard}>
          <Text style={s.lostTitle}>● LOST ALERT BROADCAST ACTIVE</Text>
          <Text style={s.lostSub}>Community radar active. Scans of your QR tag will transmit pings.</Text>
          <Btn kind="tint" t="Mark Pet as Found" onPress={() => setLost(false)} />
        </View>
      ) : (
        <View style={s.card}>
          <Text style={s.h2}>Safety Relay</Text>
          <Text style={s.sub}>All protection protocols active. Digital QR ID linked to SafeNet relay.</Text>
          <Btn kind="red" t={`🚨 Report ${activePet?.name || 'Pet'} Lost`} onPress={() => setLost(true)} />
        </View>
      )}

      {/* Logout Action Button */}
      <Pressable style={s.logoutBtn} onPress={handleLogout}>
        <Text style={s.logoutTxt}>🚪 Log Out of Account</Text>
      </Pressable>

      {/* Edit Owner Modal */}
      <OnboardingModal visible={showEditOwner} onClose={() => setShowEditOwner(false)} />

      {/* Add New Pet Modal */}
      <Modal visible={showAddPet} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.h2}>Add New Pet</Text>
            <Field label="Pet Name" placeholder="e.g. Milo" value={petName} onChangeText={setPetName} />
            <Field label="Breed" placeholder="e.g. Beagle / Domestic" value={breed} onChangeText={setBreed} />
            <Field label="Microchip Number" placeholder="Auto-generated if empty" value={chip} onChangeText={setChip} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Btn kind="out" t="Cancel" onPress={() => setShowAddPet(false)} />
              <Btn kind="tint" t="Save Pet" onPress={handleAddPetSubmit} />
            </View>
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
  ownerCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14, gap: 8 },
  ownerTitle: { fontWeight: '700', fontSize: 14, color: C.ink },
  editLink: { fontSize: 12, color: C.pri, fontWeight: '700' },
  ownerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  ownerDetail: { fontSize: 12, color: C.ink2 },
  bold: { fontWeight: '700', color: C.ink },
  addPetBtn: { backgroundColor: C.mint, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  addPetTxt: { fontSize: 12, fontWeight: '700', color: C.ink },
  petChipCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, padding: 10, borderRadius: 14, minWidth: 130 },
  petChipName: { fontSize: 13, fontWeight: '700', color: C.ink },
  petChipSub: { fontSize: 10, color: C.ink2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 20, padding: 16, gap: 10 },
  lostCard: { backgroundColor: C.redBg, borderWidth: 2, borderColor: C.red, borderRadius: 20, padding: 16, gap: 10 },
  lostTitle: { color: C.redInk, fontWeight: '800', fontSize: 13 },
  lostSub: { color: C.redInk, fontSize: 12 },
  logoutBtn: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  logoutTxt: { color: C.red, fontWeight: '800', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: C.card, borderRadius: 20, padding: 20, gap: 10 },
});