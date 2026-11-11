import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { C } from '../constants/theme';

export default function Pass({ p }: { p: { name: string; emo: string; breed: string; owner: string; chip: string; vax: boolean } }) {
  return (
    <View style={s.passCard}>
      <View style={s.rowBetween}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 40 }}>{p.emo}</Text>
          <View>
            <Text style={s.petName}>{p.name}</Text>
            <Text style={s.breed}>{p.breed}</Text>
          </View>
        </View>
        {/* QR Code Matrix Placeholder */}
        <View style={s.qrBox}>
          <Svg height={48} width={48} viewBox="0 0 24 24">
            <Rect x="2" y="2" width="8" height="8" rx="1" fill={C.ink} />
            <Rect x="14" y="2" width="8" height="8" rx="1" fill={C.ink} />
            <Rect x="2" y="14" width="8" height="8" rx="1" fill={C.ink} />
            <Rect x="14" y="14" width="3" height="3" fill={C.ink} />
            <Rect x="19" y="19" width="3" height="3" fill={C.ink} />
          </Svg>
        </View>
      </View>
      <View style={s.divider} />
      <View style={s.rowBetween}>
        <View>
          <Text style={s.metaLabel}>MICROCHIP</Text>
          <Text style={s.metaVal}>{p.chip}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.metaLabel}>VACCINATION</Text>
          <Text style={[s.metaVal, { color: C.pri }]}>{p.vax ? '✓ Up to Date' : 'Pending'}</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  passCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 24, padding: 18, gap: 14 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petName: { fontSize: 22, fontWeight: '900', color: C.ink },
  breed: { fontSize: 13, color: C.ink2 },
  qrBox: { width: 56, height: 56, backgroundColor: C.field, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.line },
  divider: { height: 1, backgroundColor: C.line },
  metaLabel: { fontSize: 10, fontWeight: '700', color: C.ink2, letterSpacing: 0.5 },
  metaVal: { fontSize: 13, fontWeight: '700', color: C.ink, marginTop: 2 },
});