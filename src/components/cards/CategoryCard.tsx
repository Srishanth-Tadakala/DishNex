// ==============================================================================
// DISHNEX CATEGORY GRID CARD (Exact Reference Screen 7 Layout)
// Rich Surface Depth, Crisp Food Photography & Selection Feedback
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
import * as Haptics from 'expo-haptics';
import { MenuCategory } from '../../types';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';

interface CategoryCardProps {
  category: MenuCategory;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
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
      toValue: 0.96,
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
    <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`${category.name}, ${category.itemCount || 12} items`}
      >
        {category.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: category.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            {/* Subtle bottom gradient vignette */}
            <View style={styles.vignette} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {category.name}
          </Text>
          <Text style={styles.itemCount}>
            {category.itemCount || 12} items
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    ...shadows.card,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSecondary,
    marginBottom: spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 26, 20, 0.15)',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  itemCount: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
});
