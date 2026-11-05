// ==============================================================================
// DISHNEX TODAY'S SPECIAL HERO CARD (Exact Reference Screen 6 Layout)
// Elevated Emerald Card, Ambient Food Glow & Tactile Action Navigation
// ==============================================================================

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (_) {}

    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  return (
    <View style={styles.outerContainer}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.card}
          accessibilityRole="button"
          accessibilityLabel={`Today's Special, ${item.name}`}
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

          {/* Right Plate Photo with glowing aura & circular lime arrow */}
          <View style={styles.imageWrapper}>
            <View style={styles.plateGlow} />
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
    ...shadows.cardElevated,
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
    letterSpacing: 0.3,
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
  plateGlow: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: 'rgba(72, 199, 131, 0.15)',
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
    ...shadows.accent,
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
    width: 20,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
});
