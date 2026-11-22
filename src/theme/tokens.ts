/**
 * Minimal design tokens.
 * One accent, neutral surfaces, a 4pt spacing scale and five type sizes.
 * If a value is not in this file it does not belong in the UI.
 */

export const colors = {
  bg: '#090B10',
  surface: '#10141C',
  surfaceRaised: '#171C26',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.15)',

  text: '#F5F5FA',
  textSecondary: '#9298A8',
  textTertiary: '#6B7280',

  accent: '#8B7CFF',
  accentPressed: '#7A6BEE',
  accentSoft: 'rgba(139,124,255,0.13)',

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
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const type = {
  display: 32,
  title: 24,
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
