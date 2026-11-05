// ==============================================================================
// SCREEN 06 — HOME / DISCOVER (DishNex Luxury Presentation & Micro-Interactions)
// ==============================================================================

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../theme/colors';
import { radii, spacing, shadows } from '../../../theme/spacing';
import { SegmentedControl } from '../../../components/common/SegmentedControl';
import { SpecialPlateCard } from '../../../components/cards/SpecialPlateCard';
import { FoodCard } from '../../../components/cards/FoodCard';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
import { MenuCategory, MenuItem, OrderType } from '../../../types';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { orderType, setOrderType } = useCartStore();

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [featuredItem, setFeaturedItem] = useState<MenuItem | null>(null);
  const [trendingItems, setTrendingItems] = useState<MenuItem[]>([]);

  // Entrance animations
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    async function loadHomeData() {
      const [cats, feat, items] = await Promise.all([
        api.getCategories(),
        api.getFeaturedItem(),
        api.getMenuItems('c-biryani'),
      ]);
      setCategories(cats);
      setFeaturedItem(feat);
      setTrendingItems(items);

      Animated.parallel([
        Animated.timing(heroFade, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(heroSlide, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
    loadHomeData();
  }, []);

  const handleSearchFocus = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (_) {}
    router.push('/(customer)/search');
  };

  const handleCategoryPress = (catId: string) => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
    } catch (_) {}
    router.push(`/(customer)/category/${catId}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header (Avatar, Greeting, Notification) */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(customer)/profile')}
          style={styles.profileRow}
          accessibilityRole="button"
          accessibilityLabel="Open user profile"
        >
          <Image
            source={{
              uri:
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingSub}>Good Evening,</Text>
            <Text style={styles.greetingName}>{user?.fullName || 'Siddu'} 👋</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(customer)/orders')}
          style={styles.notificationButton}
          accessibilityRole="button"
          accessibilityLabel="View notifications and order updates"
        >
          <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* 2. Search Bar Shortcut with subtle focus glow */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSearchFocus}
        style={styles.searchBar}
        accessibilityRole="search"
        accessibilityLabel="Search dishes and cuisines"
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <Text style={styles.searchPlaceholder}>
          Search for dishes, cuisines...
        </Text>
      </TouchableOpacity>

      {/* 3. Order Selector (Dine In / Takeaway / Delivery) */}
      <SegmentedControl
        options={[
          { key: 'dine_in', label: 'Dine In' },
          { key: 'takeaway', label: 'Takeaway' },
          { key: 'delivery', label: 'Delivery' },
        ]}
        selectedKey={orderType}
        onSelect={(key) => setOrderType(key as OrderType)}
        style={styles.orderSelector}
      />

      {/* 4. Today's Special Hero Card with Entrance Animation */}
      {featuredItem && (
        <Animated.View
          style={{
            opacity: heroFade,
            transform: [{ translateY: heroSlide }],
          }}
        >
          <SpecialPlateCard
            item={featuredItem}
            onPress={() => router.push(`/(customer)/food/${featuredItem.id}`)}
          />
        </Animated.View>
      )}

      {/* 5. Categories Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity
          onPress={() => router.push('/(customer)/(tabs)/menu')}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllLink}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Horizontal Carousel with Tactile Feedback */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            onPress={() => handleCategoryPress(cat.id)}
            style={styles.categoryItem}
            accessibilityRole="button"
            accessibilityLabel={`${cat.name} category`}
          >
            <View style={styles.categoryCircle}>
              {cat.imageUrl && (
                <Image source={{ uri: cat.imageUrl }} style={styles.categoryThumb} />
              )}
            </View>
            <Text style={styles.categoryLabel}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 6. Popular / Trending Biryani Selections */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
      </View>

      <View style={styles.trendingList}>
        {trendingItems.slice(0, 3).map((dish) => (
          <FoodCard
            key={dish.id}
            item={dish}
            onPress={() => router.push(`/(customer)/food/${dish.id}`)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 54,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  greetingTextContainer: {
    marginLeft: spacing.md,
  },
  greetingSub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    color: colors.textMuted,
    fontSize: 14,
  },
  orderSelector: {
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  categoriesRow: {
    paddingRight: spacing.lg,
    gap: spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    width: 68,
  },
  categoryCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    marginBottom: 6,
    ...shadows.card,
  },
  categoryThumb: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  trendingList: {
    marginTop: spacing.xs,
  },
});
