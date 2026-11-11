import React from 'react';
import { Pressable, Text, TextInput, StyleSheet, View } from 'react-native';
import { C } from '../constants/theme';

export function Btn({ t, onPress, kind = 'tint' }: { t: string; onPress: () => void; kind?: 'tint' | 'out' | 'red' }) {
  const bg = kind === 'tint' ? C.pri : kind === 'red' ? C.red : 'transparent';
  const border = kind === 'out' ? C.line : 'transparent';
  const color = kind === 'out' ? C.ink : '#fff';

  return (
    <Pressable style={[s.btn, { backgroundColor: bg, borderColor: border }]} onPress={onPress}>
      <Text style={[s.btnTxt, { color }]}>{t}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: { label: string; [key: string]: any }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput style={s.input} placeholderTextColor="#9ca3af" {...props} />
    </View>
  );
}

export function Chip({ t, red }: { t: string; red?: boolean }) {
  return (
    <View style={[s.chip, red && { backgroundColor: C.redBg, borderColor: C.red }]}>
      <Text style={[s.chipTxt, red && { color: C.redInk }]}>{t}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  btn: { height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  btnTxt: { fontSize: 14, fontWeight: '800' },
  label: { fontSize: 12, fontWeight: '700', color: C.ink },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: C.field, paddingHorizontal: 14, fontSize: 14, color: C.ink },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: C.mint, borderWidth: 1, borderColor: C.line, alignSelf: 'flex-start' },
  chipTxt: { fontSize: 11, fontWeight: '700', color: C.ink },
});