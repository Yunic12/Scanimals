import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { C } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.card,
          borderTopColor: C.line,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: C.pri,
        tabBarInactiveTintColor: C.ink2,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'TikTok Feed',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎬</Text>,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🚨</Text>,
        }}
      />
    </Tabs>
  );
}