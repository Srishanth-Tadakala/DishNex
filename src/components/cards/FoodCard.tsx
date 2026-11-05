// ==============================================================================
// DISHNEX FOOD CARD (Exact Reference Screen 8 / 10 / 11 Layout)
// Rich Surface Depth, Heart Bounce Animation & Tactile Add-to-Cart Feedback
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

  // Heart bounce animation
  const heartScale = useRef(new Animated.Value(1)).current;
  // Add button spring scale
  const addScale = useRef(new Animated.Value(1)).current;

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (_) {}

    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    toggleFavoriteDish(item);
  };

  const handleAddPress = (e: any) => {
    e.stopPropagation();
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (_) {}

    Animated.sequence([
      Animated.timing(addScale, {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(addScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    addItem(item, [], 1);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, isIvory && styles.cardIvory]}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${formatPaise(item.pricePaise)}`}
    >
      {/* Food Thumbnail with crisp rounded corners */}
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
          textColor={isIvory ? '#071A14' : undefined}
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
              size={19}
              color={isFav ? '#FF4D4D' : isIvory ? '#91A397' : colors.textSecondary}
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
    backgroundColor: '#FFF8EA',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  nameIvory: {
    color: '#071A14',
  },
  priceIvory: {
    color: '#071A14',
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
    padding: 3,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.accent,
  },
});
