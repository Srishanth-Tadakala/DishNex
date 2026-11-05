// ==============================================================================
// SCREEN 09 — FOOD DETAILS (Exact Reference Screen 9 Layout & Micro-Interactions)
// ==============================================================================

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../theme/colors';
import { radii, spacing, shadows } from '../../../theme/spacing';
import { QuantityStepper } from '../../../components/common/QuantityStepper';
import { RatingBadge } from '../../../components/common/RatingBadge';
import { formatPaise } from '../../../utils/currency';
import { api } from '../../../services/api';
import { MOCK_MENU_ITEMS } from '../../../services/mockData';
import { useCartStore } from '../../../store/cartStore';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { MenuItem, MenuItemAddon } from '../../../types';

const { width, height } = Dimensions.get('window');

export default function FoodDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [dish, setDish] = useState<MenuItem | null>(
    MOCK_MENU_ITEMS.find((i) => i.id === (id || 'm-hyd-chicken-biryani')) || MOCK_MENU_ITEMS[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);

  const { addItem } = useCartStore();
  const { isDishFavorite, toggleFavoriteDish } = useFavoritesStore();

  // Animation values
  const heartScale = useRef(new Animated.Value(1)).current;
  const cartBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    async function loadDish() {
      const targetId = id || 'm-hyd-chicken-biryani';
      const item = await api.getMenuItemById(targetId);
      if (item) {
        setDish(item);
      }
    }
    loadDish();
  }, [id]);

  if (!dish) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading culinary details...</Text>
      </View>
    );
  }

  const isFav = isDishFavorite(dish.id);

  const handleFavoritePress = () => {
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

    toggleFavoriteDish(dish);
  };

  const toggleAddon = (addon: MenuItemAddon) => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
    } catch (_) {}

    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const addonsTotalPaise = selectedAddons.reduce((sum, a) => sum + a.pricePaise, 0);
  const unitPricePaise = dish.pricePaise + addonsTotalPaise;
  const totalPricePaise = unitPricePaise * quantity;

  const handleAddToCart = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (_) {}

    Animated.sequence([
      Animated.timing(cartBtnScale, {
        toValue: 0.94,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(cartBtnScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    addItem(dish, selectedAddons, quantity);
    router.push('/(customer)/(tabs)/cart');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* 1. Hero Image Container */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: dish.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Floating Back Button */}
          <TouchableOpacity
            style={styles.floatingBackButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Floating Favorite Button */}
          <TouchableOpacity
            style={styles.floatingFavButton}
            onPress={handleFavoritePress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={22}
                color={isFav ? '#FF4D4D' : colors.textPrimary}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* 2. Content Card Sheet (Tactile Ivory Background) */}
        <View style={styles.contentCard}>
          {/* Title Row with Heart */}
          <View style={styles.titleRow}>
            <Text style={styles.dishTitle}>{dish.name}</Text>
            <TouchableOpacity
              onPress={handleFavoritePress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFav ? '#FF4D4D' : '#91A397'}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <RatingBadge
              rating={dish.rating}
              reviewsCount={dish.reviewsCount}
              size="medium"
              showCountText={true}
              textColor="#06130F"
            />
          </View>

          {/* Description */}
          <Text style={styles.description}>{dish.description}</Text>

          {/* 3 Metric Badges: Spicy | Serves | Calories */}
          <View style={styles.badgesRow}>
            {/* Spicy Level */}
            <View style={styles.badgeCard}>
              <MaterialCommunityIcons
                name="chili-medium"
                size={20}
                color={colors.accent}
              />
              <Text style={styles.badgeLabel}>Spicy</Text>
              <Text style={styles.badgeValue}>
                {dish.spiceLevel.charAt(0).toUpperCase() + dish.spiceLevel.slice(1)}
              </Text>
            </View>

            {/* Serving Info */}
            <View style={styles.badgeCard}>
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={20}
                color={colors.accent}
              />
              <Text style={styles.badgeLabel}>Serves</Text>
              <Text style={styles.badgeValue}>{dish.servingInfo || '1-2'}</Text>
            </View>

            {/* Calories */}
            <View style={styles.badgeCard}>
              <MaterialCommunityIcons
                name="fire"
                size={20}
                color={colors.accent}
              />
              <Text style={styles.badgeLabel}>Calories</Text>
              <Text style={styles.badgeValue}>~{dish.calories || 690}</Text>
            </View>
          </View>

          {/* Add-ons Section */}
          {dish.addons && dish.addons.length > 0 && (
            <View style={styles.addonsSection}>
              <Text style={styles.addonsSectionTitle}>Add-ons</Text>
              {dish.addons.map((addon) => {
                const isSelected = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <TouchableOpacity
                    key={addon.id}
                    activeOpacity={0.8}
                    onPress={() => toggleAddon(addon)}
                    style={styles.addonItem}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                  >
                    <View style={styles.addonLeft}>
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={colors.textDark}
                          />
                        )}
                      </View>
                      <Text style={styles.addonName}>{addon.name}</Text>
                    </View>
                    <Text style={styles.addonPrice}>
                      +{formatPaise(addon.pricePaise)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 3. Bottom Sticky Action Bar with Animated Price & Stepper */}
      <View style={styles.bottomBar}>
        {/* Quantity Stepper */}
        <QuantityStepper
          quantity={quantity}
          onIncrement={() => setQuantity((q) => q + 1)}
          onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
          size="medium"
        />

        {/* Add to Cart Button with Dynamic Total */}
        <Animated.View style={{ flex: 1, transform: [{ scale: cartBtnScale }] }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAddToCart}
            style={styles.addToCartButton}
            accessibilityRole="button"
            accessibilityLabel={`Add to Cart, total ${formatPaise(totalPricePaise)}`}
          >
            <Text style={styles.addToCartText}>
              Add to Cart   {formatPaise(totalPricePaise)}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  scroll: {
    paddingBottom: 110,
  },
  heroContainer: {
    width: '100%',
    height: height * 0.42,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingBackButton: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(7, 26, 20, 0.70)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  floatingFavButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(7, 26, 20, 0.70)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  contentCard: {
    marginTop: -28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#F4F0E7',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    ...shadows.cardElevated,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dishTitle: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#06130F',
    flex: 1,
    paddingRight: spacing.md,
  },
  ratingRow: {
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14,
    color: '#4A5B50',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  badgeLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  badgeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  addonsSection: {
    marginTop: spacing.md,
    marginBottom: spacing.xxxl,
  },
  addonsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#06130F',
    marginBottom: spacing.md,
  },
  addonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  addonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#79877D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  addonName: {
    fontSize: 14,
    color: '#06130F',
    fontWeight: '500',
  },
  addonPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#06130F',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    ...shadows.bottomBar,
  },
  addToCartButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    ...shadows.accent,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
  },
});
