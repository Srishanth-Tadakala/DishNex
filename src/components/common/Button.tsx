// ==============================================================================
// EMBER BUTTON COMPONENT (Design System Specification)
// ==============================================================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      base.backgroundColor = colors.accent;
      Object.assign(base, shadows.accent);
    } else if (variant === 'secondary') {
      base.backgroundColor = colors.surfaceSecondary;
      base.borderWidth = 1;
      base.borderColor = colors.borderSubtle;
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
      letterSpacing: 0.3,
    };
  };

  const iconColor = variant === 'primary' ? colors.textDark : colors.textPrimary;
  const iconSize = size === 'small' ? 16 : 18;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <View style={styles.content}>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

