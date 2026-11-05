// ==============================================================================
// DISHNEX TODAY'S SPECIAL HERO CARD (Industry-Grade Luxury Specification)
// Elevated Emerald Card, Ambient Food Aura & Tactile Arrow Action
// ==============================================================================

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from '../../types';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { triggerHaptic } from '../../theme/animations';

interface SpecialPlateCardProps {
  item: MenuItem;
  onPress: () => void;
}

export const SpecialPlateCard: React.FC<SpecialPlateCardProps> = ({
  item,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const arrowScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    triggerHaptic.light();
    Animated.spring(scaleAnim, {
      toValue: 0.985,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
    Animated.spring(arrowScale, {
      toValue: 1.15,
      useNativeDriver: true,
      friction: 4,
      tension: 80,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 60,
    }).start();
    Animated.spring(arrowScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 60,
    }).start();
  };

  return (
    <View style={styles.outerContainer}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.94}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.card}
          accessibilityRole="button"
          accessibilityLabel={`Today's Special, ${item.name}`}
        >
          {/* Left Information */}
          <View style={styles.textContainer}>
            <View style={styles.taglineBadge}>
              <Text style={styles.tagline}>Today's Special</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>

          {/* Right Plate Photo with glowing aura & circular lime arrow */}
          <View style={styles.imageWrapper}>
            <View style={styles.plateGlow} />
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.plateImage}
              resizeMode="cover"
            />
            <Animated.View
              style={[
                styles.arrowButton,
                { transform: [{ scale: arrowScale }] },
              ]}
            >
              <Ionicons name="arrow-forward" size={16} color={colors.textDark} />
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Pagination Dots */}
      <View style={styles.dotsRow}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
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
    position: 'relative',
    ...shadows.cardElevated,
  },
  textContainer: {
    flex: 1.2,
    justifyContent: 'center',
    paddingRight: spacing.sm,
  },
  taglineBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(216, 240, 107, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 25,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: spacing.xs,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  plateGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(216, 240, 107, 0.12)',
  },
  plateImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...shadows.accent,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceSecondary,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 22,
    backgroundColor: colors.accent,
    borderRadius: 3,
    ...shadows.accent,
  },
});
