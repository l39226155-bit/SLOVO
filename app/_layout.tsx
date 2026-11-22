import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Loading } from '@/components/ui';
import { AudioErrorToast } from '@/components/AudioButton';
import { colors } from '@/theme/tokens';
import { prepareVoices } from '@/services/audio';
import { markHydrated, useAppStore } from '@/store/useAppStore';

export default function RootLayout() {
  const hydrated = useAppStore((state) => state.hydrated);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.bg).catch(() => undefined);
    prepareVoices();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => markHydrated(), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!hydrated) return <Loading label="Wird geladen" />;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="onboarding" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="lesson/[id]" options={{ gestureEnabled: false }} />
          <Stack.Screen name="review" options={{ gestureEnabled: false }} />
        </Stack>
        <AudioErrorToast />
      </View>
    </SafeAreaProvider>
  );
}
