import React, { useEffect, useRef, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout, motion, radii, spacing, type as typeScale } from '@/theme/tokens';

/* ------------------------------------------------------------------ text */

export type TextVariant = 'display' | 'title' | 'headline' | 'body' | 'caption' | 'micro';
export type TextTone = 'default' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'danger' | 'warning';

const variants: Record<TextVariant, TextStyle> = {
  display: { fontSize: typeScale.display, fontWeight: '700', letterSpacing: -1, lineHeight: 38 },
  title: { fontSize: typeScale.title, fontWeight: '600', letterSpacing: -0.5, lineHeight: 30 },
  headline: { fontSize: typeScale.headline, fontWeight: '600', letterSpacing: -0.15, lineHeight: 23 },
  body: { fontSize: typeScale.body, fontWeight: '400', lineHeight: 22 },
  caption: { fontSize: typeScale.caption, fontWeight: '400', lineHeight: 18 },
  micro: { fontSize: typeScale.micro, fontWeight: '600', letterSpacing: 0.6, lineHeight: 14, textTransform: 'uppercase' },
};

const tones: Record<TextTone, string> = {
  default: colors.text,
  secondary: colors.textSecondary,
  tertiary: colors.textTertiary,
  accent: colors.accent,
  success: colors.success,
  danger: colors.danger,
  warning: colors.warning,
};

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  center?: boolean;
  weight?: TextStyle['fontWeight'];
  size?: number;
}

export function Text({ variant = 'body', tone = 'default', center, weight, size, style, ...rest }: AppTextProps) {
  return (
    <RNText
      {...rest}
      style={[
        variants[variant],
        { color: tones[tone] },
        center && { textAlign: 'center' },
        weight ? { fontWeight: weight } : null,
        size ? { fontSize: size, lineHeight: Math.round(size * 1.4) } : null,
        style,
      ]}
    />
  );
}

/* ---------------------------------------------------------------- screen */

export function Screen({
  children,
  scroll = true,
  contentStyle,
  footer,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  const inner = (
    <View style={[{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center', paddingHorizontal: layout.padding }, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xxxl }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {inner}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingTop: insets.top + spacing.lg }}>{inner}</View>
      )}
      {footer}
    </View>
  );
}

export function ScreenHeader({
  title,
  onBack,
  right,
  subtitle,
}: {
  title?: string;
  onBack: () => void;
  right?: ReactNode;
  subtitle?: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screenHeader, { paddingTop: insets.top + spacing.sm }]}>
      <IconButton icon="chevron-back" onPress={onBack} accessibilityLabel="Zurück" size={36} />
      <View style={{ flex: 1, paddingHorizontal: spacing.sm }}>
        {title ? (
          <Text variant="headline" numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text variant="caption" tone="tertiary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? <View style={{ width: 36 }} />}
    </View>
  );
}

/* --------------------------------------------------------------- surface */

export function Surface({
  children,
  onPress,
  style,
  padded = true,
  tone = 'default',
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  tone?: 'default' | 'accent' | 'success' | 'danger';
}) {
  const toneStyle: ViewStyle =
    tone === 'accent'
      ? { borderColor: 'rgba(139,123,255,0.35)', backgroundColor: 'rgba(139,123,255,0.07)' }
      : tone === 'success'
        ? { borderColor: 'rgba(95,191,148,0.3)', backgroundColor: colors.successSoft }
        : tone === 'danger'
          ? { borderColor: 'rgba(226,114,127,0.3)', backgroundColor: colors.dangerSoft }
          : {};

  const content = (
    <View style={[styles.surface, padded && { padding: spacing.lg }, toneStyle, style]}>{children}</View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}>
      {content}
    </Pressable>
  );
}

/* --------------------------------------------------------------- motion */

/** Short fade-and-rise used for dashboard sections; disabled visually on web. */
export function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: motion.base + delay * 70,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [delay, progress]);

  return (
    <Animated.View
      style={[
        {
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/* --------------------------------------------------------------- buttons */

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(isDisabled) }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && { backgroundColor: pressed ? colors.accentPressed : colors.accent },
        variant === 'secondary' && { borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: 'transparent' },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        variant === 'danger' && { backgroundColor: colors.dangerSoft, borderWidth: 1, borderColor: 'rgba(226,114,127,0.35)' },
        isDisabled && { opacity: 0.4 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.text} size="small" />
      ) : (
        <View style={styles.buttonInner}>
          {icon ? (
            <Ionicons
              name={icon}
              size={17}
              color={variant === 'primary' ? '#fff' : variant === 'danger' ? colors.danger : colors.text}
            />
          ) : null}
          <Text
            variant="headline"
            weight="600"
            style={{ fontSize: 16 }}
            tone={variant === 'danger' ? 'danger' : 'default'}
            // Primary buttons use white text on the accent fill.
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  size = 40,
  tint = colors.textSecondary,
  accessibilityLabel,
  active,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  tint?: string;
  accessibilityLabel?: string;
  active?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? colors.accentSoft : 'transparent',
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Ionicons name={icon} size={Math.round(size * 0.5)} color={active ? colors.accent : tint} />
    </Pressable>
  );
}

/* -------------------------------------------------------------- progress */

export function ProgressBar({
  value,
  height = 4,
  color = colors.accent,
  track = 'rgba(255,255,255,0.08)',
  animated = true,
}: {
  value: number;
  height?: number;
  color?: string;
  track?: string;
  animated?: boolean;
}) {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const progress = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    if (!animated) {
      progress.setValue(clamped);
      return;
    }
    Animated.timing(progress, { toValue: clamped, duration: motion.base, useNativeDriver: false }).start();
  }, [clamped, animated, progress]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }}>
      <Animated.View style={{ height, width, backgroundColor: color, borderRadius: height }} />
    </View>
  );
}

/* ------------------------------------------------------------------ list */

export function ListRow({
  title,
  subtitle,
  value,
  leading,
  trailing,
  onPress,
  disabled,
  tone = 'default',
}: {
  title: string;
  subtitle?: string;
  value?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  tone?: 'default' | 'danger';
}) {
  const content = (
    <View style={styles.listRow}>
      {leading ? <View style={{ width: 28 }}>{leading}</View> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body" weight="500" tone={disabled ? 'tertiary' : tone === 'danger' ? 'danger' : 'default'} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="tertiary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="caption" tone="secondary">
          {value}
        </Text>
      ) : null}
      {trailing ?? (onPress && !disabled ? <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} /> : null)}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => ({ opacity: pressed ? 0.6 : disabled ? 0.45 : 1 })}>
      {content}
    </Pressable>
  );
}

export function SectionLabel({ children, action, onPressAction }: { children: string; action?: string; onPressAction?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
      <Text variant="micro" tone="tertiary">
        {children}
      </Text>
      {action && onPressAction ? (
        <Pressable onPress={onPressAction} hitSlop={8}>
          <Text variant="caption" tone="accent" weight="600">
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }, style]} />;
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text variant="title" weight="600">
        {value}
      </Text>
      <Text variant="caption" tone="tertiary" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/* ---------------------------------------------------------------- inputs */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, active && { backgroundColor: colors.surfaceRaised }]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text variant="caption" weight={active ? '600' : '400'} tone={active ? 'default' : 'tertiary'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Input({ label, style, ...rest }: TextInputProps & { label?: string }) {
  return (
    <View style={{ gap: spacing.sm }}>
      {label ? (
        <Text variant="caption" tone="secondary">
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, style]}
        autoCorrect={false}
        autoCapitalize="none"
        {...rest}
      />
    </View>
  );
}

/* ---------------------------------------------------------------- dialog */

export function Dialog({
  visible,
  title,
  message,
  confirmLabel = 'Bestätigen',
  destructive,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Schließen" />
        <View style={styles.dialog}>
          <Text variant="headline">{title}</Text>
          <Text variant="body" tone="secondary">
            {message}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
            <Button label="Abbrechen" variant="secondary" onPress={onCancel} style={{ flex: 1 }} />
            <Button
              label={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <View style={{ paddingVertical: spacing.xxl, gap: spacing.sm }}>
      <Text variant="headline">{title}</Text>
      <Text variant="body" tone="secondary">
        {message}
      </Text>
      {action ? <View style={{ marginTop: spacing.sm, alignItems: 'flex-start' }}>{action}</View> : null}
    </View>
  );
}

export function Loading({ label }: { label?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, backgroundColor: colors.bg }}>
      <ActivityIndicator color={colors.accent} />
      {label ? (
        <Text variant="caption" tone="tertiary">
          {label}
        </Text>
      ) : null}
    </View>
  );
}

export function Row({ children, gap = spacing.md, style }: { children: ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  surface: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  button: {
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.padding - 8,
    paddingBottom: spacing.sm,
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 48,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: typeScale.body,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
