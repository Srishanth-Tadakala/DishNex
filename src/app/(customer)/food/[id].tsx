// ==============================================================================
// SCREEN 09 — FOOD DETAILS (Exact Reference Screen 9 Layout)
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { radii, spacing, shadows } from '../../../theme/spacing';
import { QuantityStepper } from '../../../components/common/QuantityStepper';
import { RatingBadge } from '../../../components/common/RatingBadge';
import { formatPaise } from '../../../utils/currency';
import { api } from '../../../services/api';
import { useCartStore } from '../../../store/cartStore';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { MenuItem, MenuItemAddon } from '../../../types';

const { width, height } = Dimensions.get('window');

export default function FoodDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [dish, setDish] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);

  const { addItem } = useCartStore();
  const { isDishFavorite, toggleFavoriteDish } = useFavoritesStore();

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

  const toggleAddon = (addon: MenuItemAddon) => {
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
    addItem(dish, selectedAddons, quantity);
    router.push('/(customer)/(tabs)/cart');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
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
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Floating Favorite Button */}
          <TouchableOpacity
            style={styles.floatingFavButton}
            onPress={() => toggleFavoriteDish(dish)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={22}
              color={isFav ? '#E53935' : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* 2. Content Card Sheet */}
        <View style={styles.contentCard}>
          {/* Title Row with Heart */}
          <View style={styles.titleRow}>
            <Text style={styles.dishTitle}>{dish.name}</Text>
            <TouchableOpacity onPress={() => toggleFavoriteDish(dish)}>
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={24}
                color={isFav ? '#E53935' : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <RatingBadge
              rating={dish.rating}
              reviewsCount={dish.reviewsCount}
              size="medium"
              showCountText={true}
              textColor="#10271D"
            />
          </View>

          {/* Description */}
          <Text style={styles.description}>{dish.description}</Text>

          {/* 3 Metric Badges */}
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

      {/* 3. Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        {/* Quantity Stepper */}
        <QuantityStepper
          quantity={quantity}
          onIncrement={() => setQuantity((q) => q + 1)}
          onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
          size="medium"
        />

        {/* Add to Cart Button with Dynamic Total */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        >
          <Text style={styles.addToCartText}>
            Add to Cart   {formatPaise(totalPricePaise)}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(6, 19, 15, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingFavButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(6, 19, 15, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  dishTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#10271D',
    flex: 1,
    paddingRight: spacing.md,
  },
  ratingRow: {
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14,
    color: '#355344',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: '#EDE8DD',
    borderRadius: radii.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  badgeLabel: {
    fontSize: 11,
    color: '#55695E',
    marginTop: 4,
  },
  badgeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10271D',
    marginTop: 2,
  },
  addonsSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  addonsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10271D',
    marginBottom: spacing.md,
  },
  addonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
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
    color: '#10271D',
  },
  addonPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#244D3A',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F4F0E7',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.bottomBar,
  },
  addToCartButton: {
    flex: 1,
    marginLeft: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.accent,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
  },
});

