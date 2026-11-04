// ==============================================================================
// EMBER TODAY'S SPECIAL HERO CARD (Exact Reference Screen 6 Layout)
// ==============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from '../../types';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';

interface SpecialPlateCardProps {
  item: MenuItem;
  onPress: () => void;
}

export const SpecialPlateCard: React.FC<SpecialPlateCardProps> = ({
  item,
  onPress,
}) => {
  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onPress}
        style={styles.card}
      >
        {/* Left Information */}
        <View style={styles.textContainer}>
          <Text style={styles.tagline}>Today's Special</Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        {/* Right Plate Photo with lower-right circular arrow button */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.plateImage}
            resizeMode="cover"
          />
          <View style={styles.arrowButton}>
            <Ionicons name="arrow-forward" size={16} color={colors.textDark} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Pagination Dots */}
      <View style={styles.dotsRow}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
    ...shadows.card,
  },
  textContainer: {
    flex: 1.2,
    justifyContent: 'center',
    paddingRight: spacing.sm,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: spacing.md,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  plateImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceSecondary,
  },
  arrowButton: {
    position: 'absolute',
    bottom: -2,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceSecondary,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 18,
    backgroundColor: colors.accent,
  },
});

