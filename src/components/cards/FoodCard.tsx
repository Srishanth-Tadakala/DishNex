// ==============================================================================
// EMBER FOOD CARD (Exact Reference Screen 8 / 10 / 11 Layout)
// ==============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from '../../types';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { DietaryBadge } from '../common/DietaryBadge';
import { RatingBadge } from '../common/RatingBadge';
import { formatPaise } from '../../utils/currency';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useCartStore } from '../../store/cartStore';

interface FoodCardProps {
  item: MenuItem;
  onPress: () => void;
  showAddButton?: boolean;
  variant?: 'dark' | 'ivory';
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onPress,
  showAddButton = true,
  variant = 'dark',
}) => {
  const { isDishFavorite, toggleFavoriteDish } = useFavoritesStore();
  const { addItem } = useCartStore();
  const isFav = isDishFavorite(item.id);
  const isIvory = variant === 'ivory';

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavoriteDish(item);
  };

  const handleAddPress = (e: any) => {
    e.stopPropagation();
    addItem(item, [], 1);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        isIvory && styles.cardIvory,
      ]}
    >
      {/* Food Thumbnail */}
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Middle Content */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <DietaryBadge type={item.dietaryClassification} size={14} />
          <Text
            style={[
              styles.name,
              isIvory && styles.nameIvory,
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>

        <RatingBadge
          rating={item.rating}
          reviewsCount={item.reviewsCount}
          size="small"
          textColor={isIvory ? '#10271D' : undefined}
        />

        <Text
          style={[
            styles.price,
            isIvory && styles.priceIvory,
          ]}
        >
          {formatPaise(item.pricePaise)}
        </Text>
      </View>

      {/* Right Column (Heart & Add to Cart) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={handleFavoritePress}
          activeOpacity={0.7}
          style={styles.favoriteButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={18}
            color={isFav ? '#E53935' : isIvory ? '#79877D' : colors.textSecondary}
          />
        </TouchableOpacity>

        {showAddButton && (
          <TouchableOpacity
            onPress={handleAddPress}
            activeOpacity={0.8}
            style={styles.addButton}
          >
            <Ionicons name="add" size={18} color={colors.textDark} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    ...shadows.card,
  },
  cardIvory: {
    backgroundColor: '#F4F0E7',
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  nameIvory: {
    color: '#10271D',
  },
  priceIvory: {
    color: '#10271D',
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceSecondary,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 6,
    flex: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  actionsContainer: {
    height: 76,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: spacing.sm,
  },
  favoriteButton: {
    padding: 2,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

