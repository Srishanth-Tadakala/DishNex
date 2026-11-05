// ==============================================================================
// DISHNEX DESIGN SYSTEM — MOTION & INTERACTION SPECIFICATION (Industry-Grade)
// Natural Spring Physics, Tactile Haptics & Choreographed Motion Transitions
// ==============================================================================

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export const springConfig = {
  // Snappy response for buttons, toggles & steppers
  snappy: {
    friction: 5,
    tension: 80,
    useNativeDriver: true,
  },
  // Fluid response for cards, dialogs & bottom sheets
  fluid: {
    friction: 7,
    tension: 45,
    useNativeDriver: true,
  },
  // Bouncy response for celebratory badges, heart pop & cloche
  bouncy: {
    friction: 3.5,
    tension: 50,
    useNativeDriver: true,
  },
  // Gentle settling for entrance cascades
  gentle: {
    friction: 8,
    tension: 30,
    useNativeDriver: true,
  },
} as const;

export const durations = {
  instant: 100,
  quick: 180,
  standard: 260,
  deliberate: 380,
  entrance: 450,
  celebration: 700,
} as const;

// Safe, platform-guarded tactile feedback triggers
export const triggerHaptic = {
  selection: () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
    } catch (_) {}
  },
  light: () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (_) {}
  },
  medium: () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (_) {}
  },
  heavy: () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (_) {}
  },
  success: () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (_) {}
  },
  warning: () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (_) {}
  },
  error: () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (_) {}
  },
};
