// ==============================================================================
// EMBER FLAME LOGO & BRANDING COMPONENT
// ==============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface EmberFlameLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
}

export const EmberFlameLogo: React.FC<EmberFlameLogoProps> = ({
  size = 'medium',
  showTagline = true,
}) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconSize = isLarge ? 56 : isSmall ? 24 : 36;
  const titleSize = isLarge ? 32 : isSmall ? 18 : 24;

  return (
    <View style={styles.container}>
      {/* Flame Icon with subtle warm gold glow */}
      <View style={styles.flameContainer}>
        <MaterialCommunityIcons
          name="fire"
          size={iconSize}
          color="#F5C042" // Warm flame gold
        />
      </View>

      {/* Brand Title */}
      <Text style={[styles.title, { fontSize: titleSize }]}>EMBER</Text>

      {/* Tagline */}
      {showTagline && (
        <Text style={styles.tagline}>Restaurant · Dine · Order</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameContainer: {
    marginBottom: 4,
  },
  title: {
    fontFamily: 'serif',
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
});

