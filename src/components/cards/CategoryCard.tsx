// ==============================================================================
// EMBER CATEGORY GRID CARD (Exact Reference Screen 7 Layout)
// ==============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      {category.imageUrl && (
        <Image
          source={{ uri: category.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
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
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    ...shadows.card,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceSecondary,
    marginBottom: spacing.sm,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemCount: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});

