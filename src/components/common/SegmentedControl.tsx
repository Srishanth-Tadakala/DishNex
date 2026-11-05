// ==============================================================================
// DISHNEX SEGMENTED CONTROL (Pill Tab Selector)
// Tactile Selection Transitions with Luminous Lime Highlights
// ==============================================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { radii, shadows } from '../../theme/spacing';

export interface SegmentOption<T extends string> {
  key: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  selectedKey: T;
  onSelect: (key: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string>({
  options,
  selectedKey,
  onSelect,
  style,
}: SegmentedControlProps<T>) {
  const handleSelect = (key: T) => {
    if (key !== selectedKey) {
      try {
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync();
        }
      } catch (_) { }
      onSelect(key);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {options.map((opt) => {
        const isSelected = opt.key === selectedKey;
        return (
          <TouchableOpacity
            key={opt.key}
            activeOpacity={0.8}
            onPress={() => handleSelect(opt.key)}
            style={[
              styles.segment,
              isSelected ? styles.selectedSegment : styles.unselectedSegment,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              style={[
                styles.label,
                isSelected ? styles.selectedLabel : styles.unselectedLabel,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  selectedSegment: {
    backgroundColor: colors.accent,
    ...shadows.accent,
  },
  unselectedSegment: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  selectedLabel: {
    color: colors.textDark,
  },
  unselectedLabel: {
    color: colors.textSecondary,
  },
});
