import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useApp } from '../context/AppContext';
import { Field, Btn, Chip } from './UI';
import { C } from '../constants/theme';

export default function OnboardingModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { owner, updateOwnerProfile, showWelcomeSplash, dismissSplash } = useApp();

  const [name, setName] = useState(owner?.name || '');
  const [age, setAge] = useState(owner?.age || '');
  const [birthday, setBirthday] = useState(owner?.birthday || '');
  const [sex, setSex] = useState(owner?.sex || 'Female');

  const firstName = name.trim().split(' ')[0] || 'User';

  const handleSave = async () => {
    if (!name.trim()) return;
    // Quietly update profile without triggering the splash screen
    await updateOwnerProfile({ name, age, birthday, sex });
    onClose();
  };

  if (showWelcomeSplash) {
    return (
      <Modal visible animationType="fade">
        <View style={s.splashContainer}>
          <Text style={s.logoIcon}>🛡️ 🐾</Text>
          <Text style={s.welcomeText}>Welcome to Scanimals,</Text>
          <Text style={s.nameHighlight}>{firstName}!</Text>
          <Text style={s.subText}>Your pet protection & community radar is active.</Text>

          <View style={{ height: 40 }} />

          <Btn kind="tint" t="Enter Home Dashboard →" onPress={() => { dismissSplash(); onClose(); }} />
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.modalOverlay}>
        <View style={s.modalCard}>
          <View style={s.header}>
            <Text style={s.title}>Edit Owner Profile</Text>
            <Chip t="Owner Settings" />
          </View>
          <Text style={s.desc}>Modify your master Scanimals safety credentials below.</Text>

          <Field label="Full Name" placeholder="e.g. Sarah Jenkins" value={name} onChangeText={setName} />
          <Field label="Age" placeholder="e.g. 26" value={age} onChangeText={setAge} keyboardType="numeric" />
          <Field label="Birthday" placeholder="YYYY-MM-DD" value={birthday} onChangeText={setBirthday} />
          
          <Text style={s.fieldLabel}>Sex</Text>
          <View style={s.sexRow}>
            {['Female', 'Male', 'Prefer not to say'].map((item) => (
              <Pressable
                key={item}
                style={[s.sexChip, sex === item && s.sexChipActive]}
                onPress={() => setSex(item)}
              >
                <Text style={[s.sexTxt, sex === item && s.sexTxtActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
            <Btn kind="out" t="Cancel" onPress={onClose} />
            <Btn kind="tint" t="Save Changes" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 18 },
  modalCard: { backgroundColor: C.card, borderRadius: 24, padding: 20, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: C.ink },
  desc: { fontSize: 13, color: C.ink2, marginBottom: 4 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: C.ink, marginTop: 4 },
  sexRow: { flexDirection: 'row', gap: 8 },
  sexChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: C.line },
  sexChipActive: { backgroundColor: C.pri, borderColor: C.pri },
  sexTxt: { fontSize: 12, color: C.ink2, fontWeight: '600' },
  sexTxtActive: { color: C.ink, fontWeight: '800' },
  splashContainer: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logoIcon: { fontSize: 64, marginBottom: 16 },
  welcomeText: { fontSize: 24, color: C.ink2, fontWeight: '600' },
  nameHighlight: { fontSize: 38, fontWeight: '900', color: C.priDark || '#059669', marginBottom: 8 },
  subText: { fontSize: 14, color: C.ink2, textAlign: 'center' },
});