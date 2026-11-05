// ==============================================================================
// DISHNEX FOOD CARD (Industry-Grade Luxury Specification)
// Physical Card Spring Dynamics, Heart Pop, Add-to-Cart Splash & Tactile Paper
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

  // Overall card scale
  const cardScale = useRef(new Animated.Value(1)).current;
  // Heart bounce animation
  const heartScale = useRef(new Animated.Value(1)).current;
  // Add button spring scale
  const addScale = useRef(new Animated.Value(1)).current;

  const handleCardPressIn = () => {
    Animated.spring(cardScale, {
      toValue: 0.985,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handleCardPressOut = () => {
    Animated.spring(cardScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 60,
    }).start();
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    triggerHaptic.medium();

    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.45,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    toggleFavoriteDish(item);
  };

  const handleAddPress = (e: any) => {
    e.stopPropagation();
    triggerHaptic.light();

    Animated.sequence([
      Animated.timing(addScale, {
        toValue: 0.82,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(addScale, {
        toValue: 1,
        friction: 3,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    addItem(item, [], 1);
  };

  return (
    <Animated.View style={{ transform: [{ scale: cardScale }] }}>
      <TouchableOpacity
        activeOpacity={0.94}
        onPress={onPress}
        onPressIn={handleCardPressIn}
        onPressOut={handleCardPressOut}
        style={[styles.card, isIvory ? styles.cardIvory : styles.cardDark]}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${formatPaise(item.pricePaise)}`}
      >
        {/* Food Thumbnail with crisp rounded corners */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Middle Content */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <DietaryBadge type={item.dietaryClassification} size={14} />
            <Text
              style={[styles.name, isIvory && styles.nameIvory]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>

          <RatingBadge
            rating={item.rating}
            reviewsCount={item.reviewsCount}
            size="small"
            textColor={isIvory ? '#06130F' : undefined}
          />

          <Text style={[styles.price, isIvory && styles.priceIvory]}>
            {formatPaise(item.pricePaise)}
          </Text>
        </View>

        {/* Right Column (Heart & Add to Cart) */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleFavoritePress}
            activeOpacity={0.7}
            style={styles.favoriteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={20}
                color={isFav ? '#FF4D4D' : isIvory ? '#8A998E' : colors.textSecondary}
              />
            </Animated.View>
          </TouchableOpacity>

          {showAddButton && (
            <TouchableOpacity
              onPress={handleAddPress}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name} to cart`}
            >
              <Animated.View
                style={[styles.addButton, { transform: [{ scale: addScale }] }]}
              >
                <Ionicons name="add" size={19} color={colors.textDark} />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    position: 'relative',
  },
  cardDark: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  cardIvory: {
    backgroundColor: '#F4F0E7',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    ...shadows.cardIvory,
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  image: {
    width: '100%',
    height: '100%',
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
  nameIvory: {
    color: '#06130F',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  priceIvory: {
    color: '#06130F',
  },
  actionsContainer: {
    height: 76,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: spacing.sm,
  },
  favoriteButton: {
    padding: 4,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: radii.sm,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    ...shadows.accent,
  },
});
