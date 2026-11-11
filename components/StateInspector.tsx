import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';

export default function StateInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const appState = useApp();

  const { 
    login, 
    signup, 
    logout, 
    updateOwnerProfile, 
    addPet, 
    updatePet, 
    setLost, 
    dismissSplash, 
    ...serializableState 
  } = appState;

  if (!isOpen) {
    return (
      <Pressable style={s.floatingToggle} onPress={() => setIsOpen(true)}>
        <Text style={s.toggleTxt}>🔍 Inspector</Text>
      </Pressable>
    );
  }

  return (
    <View style={s.inspectorContainer}>
      <View style={s.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <Text style={s.title}>Live State Inspector</Text>
        </View>
        <Pressable onPress={() => setIsOpen(false)} style={s.closeBtn}>
          <Text style={s.closeTxt}>✕ Close</Text>
        </Pressable>
      </View>

      <ScrollView style={s.jsonScroll} contentContainerStyle={{ padding: 10 }}>
        <Text style={s.jsonText}>
          {JSON.stringify(serializableState, null, 2)}
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  floatingToggle: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    zIndex: 9999,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  toggleTxt: {
    color: '#38bdf8',
    fontWeight: '800',
    fontSize: 12,
  },
  inspectorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    zIndex: 9999,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
  },
  closeBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  closeTxt: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  jsonScroll: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  jsonText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#34d399',
    fontSize: 11,
    lineHeight: 16,
  },
});