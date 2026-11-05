// ==============================================================================
// DISHNEX FLAME LOGO & BRANDING COMPONENT
// Luxury Flame Symbol with Warm Amber/Gold Radiance and Crisp DishNex Wordmark
// ==============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface DishNexFlameLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
}

export const DishNexFlameLogo: React.FC<DishNexFlameLogoProps> = ({
  size = 'medium',
  showTagline = true,
}) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconSize = isLarge ? 58 : isSmall ? 26 : 38;
  const titleSize = isLarge ? 34 : isSmall ? 19 : 25;

  return (
    <View style={styles.container}>
      {/* Flame Icon with Warm Amber/Gold Ambient Glow */}
      <View style={styles.flameContainer}>
        {isLarge && <View style={styles.flameAmbientGlow} />}
        <MaterialCommunityIcons
          name="fire"
          size={iconSize}
          color={colors.gold} // Luminous warm flame gold #FFC66B
        />
      </View>

      {/* DishNex Wordmark (Serif Luxury Editorial Hierarchy) */}
      <Text style={[styles.title, { fontSize: titleSize }]}>
        DishNex
      </Text>

      {/* Subtitle / Tagline */}
      {showTagline && (
        <Text style={styles.tagline}>Restaurant · Dine · Order</Text>
      )}
    </View>
  );
};

// Backward-compatible alias for existing imports
export const EmberFlameLogo = DishNexFlameLogo;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameContainer: {
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameAmbientGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.goldGlow,
  },
  title: {
    fontFamily: 'serif',
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 2,
    marginTop: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});
