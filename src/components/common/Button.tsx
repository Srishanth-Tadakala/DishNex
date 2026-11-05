// ==============================================================================
// DISHNEX BUTTON COMPONENT (Design System Specification)
// Luminous Lime Action Buttons with Micro-Interactions & Haptic Response
// ==============================================================================

import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  iconRight?: keyof typeof Ionicons.glyphMap;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  iconRight,
  iconLeft,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (_) {}

    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const getContainerStyle = (): ViewStyle => {
    let base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.full,
    };

    if (fullWidth) {
      base.width = '100%';
    }

    // Size
    if (size === 'small') {
      base.paddingVertical = spacing.sm;
      base.paddingHorizontal = spacing.lg;
    } else if (size === 'medium') {
      base.paddingVertical = spacing.md;
      base.paddingHorizontal = spacing.xl;
    } else {
      // Large
      base.paddingVertical = spacing.lg;
      base.paddingHorizontal = spacing.xxl;
    }

    // Variant
    if (variant === 'primary') {
      base.backgroundColor = colors.accent; // Signature Chartreuse Lime #D8F06B
      base.borderWidth = 1;
      base.borderColor = 'rgba(255, 255, 255, 0.25)';
      Object.assign(base, shadows.accent);
    } else if (variant === 'secondary') {
      base.backgroundColor = colors.surfaceSecondary; // Deep emerald surface
      base.borderWidth = 1;
      base.borderColor = colors.border;
    } else if (variant === 'outline') {
      base.backgroundColor = 'transparent';
      base.borderWidth = 1.5;
      base.borderColor = colors.accent;
    } else {
      // Ghost
      base.backgroundColor = 'transparent';
    }

    if (disabled) {
      base.opacity = 0.5;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const isPrimary = variant === 'primary';
    return {
      fontSize: size === 'small' ? 13 : size === 'medium' ? 14 : 16,
      fontWeight: '700',
      color: isPrimary ? colors.textDark : colors.textPrimary,
      letterSpacing: isPrimary ? 0.3 : 0.2,
    };
  };

  const iconColor =
    variant === 'primary' ? colors.textDark : colors.textPrimary;
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 18 : 20;

  return (
    <Animated.View
      style={[
        fullWidth && { width: '100%' },
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[getContainerStyle(), style]}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? colors.textDark : colors.accent}
          />
        ) : (
          <View style={styles.contentRow}>
            {iconLeft && (
              <Ionicons
                name={iconLeft}
                size={iconSize}
                color={iconColor}
                style={styles.iconLeft}
              />
            )}
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            {iconRight && (
              <Ionicons
                name={iconRight}
                size={iconSize}
                color={iconColor}
                style={styles.iconRight}
              />
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});
