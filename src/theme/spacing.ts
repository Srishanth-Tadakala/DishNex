// ==============================================================================
// DISHNEX DESIGN SYSTEM — SPACING, RADII & ELEVATED SHADOWS (Industry-Grade)
// Cross-platform shadows supporting web standard boxShadow and native elevation
// ==============================================================================

import { Platform, ViewStyle } from 'react-native';

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999, // Pill buttons, circular avatars
} as const;

const hexToRgba = (hex: string, opacity: number): string => {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const makeShadow = (
  x: number,
  y: number,
  blur: number,
  color: string,
  opacity: number,
  elevation: number
): ViewStyle => {
  const rgba = color.startsWith('#') ? hexToRgba(color, opacity) : color;
  return Platform.select<ViewStyle>({
    web: {
      boxShadow: `${x}px ${y}px ${blur}px ${rgba}`,
    } as unknown as ViewStyle,
    default: {
      shadowColor: color,
      shadowOffset: { width: x, height: y },
      shadowOpacity: opacity,
      shadowRadius: blur,
      elevation,
    },
  })!;
};

export const shadows = {
  card: makeShadow(0, 4, 10, '#000000', 0.40, 5),
  cardElevated: makeShadow(0, 6, 14, '#000000', 0.50, 8),
  cardIvory: makeShadow(0, 3, 8, '#000000', 0.08, 3),
  accent: makeShadow(0, 4, 12, '#D8F06B', 0.35, 6),
  emeraldGlow: makeShadow(0, 3, 10, '#244D3A', 0.25, 4),
  goldGlow: makeShadow(0, 3, 10, '#F5C042', 0.30, 5),
  bottomBar: makeShadow(0, -4, 16, '#000000', 0.45, 10),
};
