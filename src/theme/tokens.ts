/**
 * Minimal design tokens.
 * One accent, neutral surfaces, a 4pt spacing scale and five type sizes.
 * If a value is not in this file it does not belong in the UI.
 */

export const colors = {
  bg: '#0A0B0D',
  surface: '#111214',
  surfaceRaised: '#17191C',
  border: 'rgba(255,255,255,0.075)',
  borderStrong: 'rgba(255,255,255,0.16)',

  text: '#F2F3F5',
  textSecondary: '#9CA3AD',
  textTertiary: '#6C737D',

  accent: '#8B7BFF',
  accentPressed: '#7A69F2',
  accentSoft: 'rgba(139,123,255,0.12)',

  success: '#5FBF94',
  successSoft: 'rgba(95,191,148,0.12)',
  danger: '#E2727F',
  dangerSoft: 'rgba(226,114,127,0.12)',
  warning: '#D9A75E',

  overlay: 'rgba(0,0,0,0.62)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const type = {
  display: 28,
  title: 22,
  headline: 17,
  body: 15,
  caption: 13,
  micro: 11,
} as const;

export const motion = {
  fast: 140,
  base: 220,
} as const;

export const layout = {
  padding: 20,
  maxWidth: 680,
} as const;
