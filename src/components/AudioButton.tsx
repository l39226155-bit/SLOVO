import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, motion, radii, spacing } from '@/theme/tokens';
import { clearAudioError, toggleAudio, useAudioStore } from '@/services/audio';
import { Text } from '@/components/ui';

/**
 * One button for every pronunciation in the app.
 * Idle → speaker, playing → pause, paused → play, loading → spinner, error → alert.
 */
export function AudioButton({
  text,
  audioKey,
  size = 'md',
  rate,
  lang = 'ru-RU',
  accessibilityLabel,
}: {
  text: string;
  audioKey: string;
  size?: 'sm' | 'md' | 'lg';
  rate?: number;
  lang?: 'ru-RU' | 'de-DE';
  accessibilityLabel?: string;
}) {
  const status = useAudioStore((state) => state.status);
  const activeKey = useAudioStore((state) => state.activeKey);
  const isActive = activeKey === audioKey;

  const dimension = size === 'lg' ? 56 : size === 'md' ? 40 : 30;
  const iconSize = Math.round(dimension * 0.44);

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!isActive || status !== 'playing') {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isActive, status, pulse]);

  const effectiveStatus = isActive ? status : 'idle';
  const loading = effectiveStatus === 'loading';
  const playing = effectiveStatus === 'playing';
  const paused = effectiveStatus === 'paused';
  const error = effectiveStatus === 'error';

  const icon: keyof typeof Ionicons.glyphMap = playing
    ? 'pause'
    : paused
      ? 'play'
      : error
        ? 'alert-circle-outline'
        : 'volume-medium-outline';

  const tint = error ? colors.danger : isActive ? colors.accent : colors.textSecondary;

  const label = loading
    ? 'Wird geladen'
    : playing
      ? 'Pause'
      : paused
        ? 'Fortsetzen'
        : error
          ? 'Erneut versuchen'
          : accessibilityLabel ?? 'Aussprache anhören';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${text}`}
      accessibilityState={{ busy: loading, selected: isActive }}
      hitSlop={6}
      onPress={() => toggleAudio({ key: audioKey, text, lang, rate })}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
      <Animated.View
        style={[
          styles.button,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
            transform: [{ scale: pulse }],
            backgroundColor: size === 'lg' ? colors.accentSoft : 'transparent',
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Ionicons name={icon} size={iconSize} color={tint} />
        )}
      </Animated.View>
    </Pressable>
  );
}

/** Global, dismissible message when playback fails. */
export function AudioErrorToast() {
  const error = useAudioStore((state) => state.error);
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!error) return;
    Animated.timing(fade, { toValue: 1, duration: motion.fast, useNativeDriver: true }).start();
    const timer = setTimeout(() => clearAudioError(), 6000);
    return () => clearTimeout(timer);
  }, [error, fade]);

  if (!error) return null;

  return (
    <Animated.View style={[styles.toast, { bottom: insets.bottom + spacing.lg, opacity: fade }]}>
      <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
      <Text variant="caption" style={{ flex: 1 }}>
        {error}
      </Text>
      <Pressable onPress={clearAudioError} hitSlop={8}>
        <Ionicons name="close" size={16} color={colors.textTertiary} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(226,114,127,0.35)',
    backgroundColor: '#1C1416',
  },
});
