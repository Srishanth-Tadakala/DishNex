// ==============================================================================
// DISHNEX BUTTON COMPONENT (Industry-Grade Luxury Specification)
// Haute Chartreuse Multi-Stop Gradients, Specular Lighting & Spring Dynamics
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { triggerHaptic } from '../../theme/animations';

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
    triggerHaptic.light();

    Animated.spring(scaleAnim, {
      toValue: 0.965,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 60,
    }).start();
  };

  // Sizing dimensions
  const getPadding = () => {
    if (size === 'small') {
      return { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg };
    }
    if (size === 'medium') {
      return { paddingVertical: spacing.md, paddingHorizontal: spacing.xl };
    }
    return { paddingVertical: 14, paddingHorizontal: spacing.xxl };
  };

  const getTextStyle = (): TextStyle => {
    const isPrimary = variant === 'primary';
    return {
      fontSize: size === 'small' ? 13 : size === 'medium' ? 14 : 16,
      fontWeight: '800',
      color: isPrimary ? colors.textDark : colors.textPrimary,
      letterSpacing: isPrimary ? 0.3 : 0.2,
    };
  };

  const iconColor =
    variant === 'primary' ? colors.textDark : colors.textPrimary;
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 18 : 20;

  const renderContent = () => (
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
  );

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
        style={[
          styles.baseContainer,
          fullWidth && { width: '100%' },
          variant === 'outline' && styles.outlineContainer,
          variant === 'ghost' && styles.ghostContainer,
          disabled && styles.disabledContainer,
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {variant === 'primary' ? (
          <LinearGradient
            colors={[colors.accent, colors.accentSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientInner, getPadding()]}
          >
            {/* Top specular hairline highlight */}
            <View style={styles.specularHighlight} />
            {loading ? (
              <ActivityIndicator size="small" color={colors.textDark} />
            ) : (
              renderContent()
            )}
          </LinearGradient>
        ) : variant === 'secondary' ? (
          <LinearGradient
            colors={[colors.surfaceSecondary, colors.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.gradientInner, styles.secondaryBorder, getPadding()]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              renderContent()
            )}
          </LinearGradient>
        ) : (
          <View style={[styles.standardInner, getPadding()]}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              renderContent()
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  gradientInner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    ...shadows.accent,
    position: 'relative',
  },
  specularHighlight: {
    position: 'absolute',
    top: 1,
    left: '12%',
    right: '12%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
    borderRadius: radii.full,
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  standardInner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledContainer: {
    opacity: 0.45,
  },
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
