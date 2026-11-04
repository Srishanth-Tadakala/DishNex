// ==============================================================================
// EMBER DESIGN SYSTEM — TYPOGRAPHY (Part 3.3 Specification)
// ==============================================================================

import { Platform, TextStyle } from 'react-native';

export const typography = {
  // Font Families with graceful system fallbacks
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }),
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
  sansMedium: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'sans-serif',
  }),

  // Font Sizes
  sizes: {
    display: 34,
    h1: 28,
    h2: 22,
    h3: 18,
    bodyLarge: 16,
    body: 14,
    caption: 12,
    tiny: 10,
  },

  // Font Weights
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  } as const,

  // Editorial Presets matching the 14-screen reference
  presets: {
    editorialTitle: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.5,
      lineHeight: 34,
    } as TextStyle,
    screenTitle: {
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: -0.3,
      lineHeight: 28,
    } as TextStyle,
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: -0.2,
      lineHeight: 22,
    } as TextStyle,
    bodyText: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    } as TextStyle,
    bodySecondary: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 18,
    } as TextStyle,
    button: {
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: 0.2,
    } as TextStyle,
    badge: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.3,
    } as TextStyle,
    price: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: -0.2,
    } as TextStyle,
  },
} as const;

