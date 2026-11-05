// ==============================================================================
// DISHNEX SEGMENTED CONTROL (Industry-Grade Luxury Specification)
// Fluid Gliding Spring Indicator, Specular Highlight & Tactile Haptic Selection
// ==============================================================================

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radii, shadows } from '../../theme/spacing';
import { triggerHaptic } from '../../theme/animations';

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
  const [containerWidth, setContainerWidth] = useState(0);
  const selectedIndex = options.findIndex((opt) => opt.key === selectedKey);
  const safeIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const slideAnim = useRef(new Animated.Value(safeIndex)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: safeIndex,
      friction: 6.5,
      tension: 65,
      useNativeDriver: true,
    }).start();
  }, [safeIndex]);

  const handleSelect = (key: T) => {
    if (key !== selectedKey) {
      triggerHaptic.selection();
      onSelect(key);
    }
  };

  const segmentWidth = containerWidth > 0 ? (containerWidth - 6) / options.length : 0;

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* Gliding Active Indicator Pill */}
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              width: segmentWidth,
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: options.map((_, i) => i),
                    outputRange: options.map((_, i) => i * segmentWidth),
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.specularHairline} />
        </Animated.View>
      )}

      {/* Options Row */}
      {options.map((opt, idx) => {
        const isSelected = opt.key === selectedKey;
        // Fallback for unmeasured initial render
        const showFallbackHighlight = segmentWidth === 0 && isSelected;

        return (
          <TouchableOpacity
            key={opt.key}
            activeOpacity={0.85}
            onPress={() => handleSelect(opt.key)}
            style={[
              styles.segment,
              showFallbackHighlight && styles.selectedSegmentFallback,
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
    position: 'relative',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    top: 3,
    left: 3,
    bottom: 3,
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    ...shadows.accent,
  },
  specularHairline: {
    position: 'absolute',
    top: 1,
    left: '15%',
    right: '15%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
    borderRadius: radii.full,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    zIndex: 2,
  },
  selectedSegmentFallback: {
    backgroundColor: colors.accent,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  selectedLabel: {
    color: colors.textDark,
  },
  unselectedLabel: {
    color: colors.textSecondary,
  },
});
