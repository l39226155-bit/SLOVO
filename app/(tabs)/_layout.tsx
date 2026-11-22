import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { colors } from '@/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 82 : 60,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 6,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500', letterSpacing: 0.1 },
        tabBarIconStyle: { marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Start',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size - 4} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: 'Kurs',
          tabBarIcon: ({ color, size }) => <Ionicons name="layers-outline" size={size - 4} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="vocab"
        options={{
          title: 'Wörter',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size - 4} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="alphabet"
        options={{
          title: 'Alphabet',
          tabBarIcon: ({ color, size }) => <Ionicons name="language-outline" size={size - 4} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Mehr',
          tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal" size={size - 4} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
