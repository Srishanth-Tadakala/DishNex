// ==============================================================================
// DISHNEX BOTTOM NAVIGATION LAYOUT ((tabs)/_layout.tsx) (Industry-Grade)
// Luxury Emerald Tab Bar with Spring Icon Dynamics & Tactile Selection
// ==============================================================================

import '../../../utils/ssr-polyfill';
import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, Platform, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { radii, shadows } from '../../../theme/spacing';
import { triggerHaptic } from '../../../theme/animations';
import { useCartStore } from '../../../store/cartStore';

interface AnimatedTabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  outlineName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  size: number;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  name,
  outlineName,
  focused,
  color,
  size,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.2, duration: 80, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Ionicons name={focused ? name : outlineName} size={size} color={color} />
    </Animated.View>
  );
};

export default function TabLayout() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* 1. Home / Discover (Screen 06) */}
      <Tabs.Screen
        name="index"
        listeners={{
          tabPress: () => triggerHaptic.selection(),
        }}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="home"
              outlineName="home-outline"
              focused={focused}
              color={color}
              size={22}
            />
          ),
        }}
      />

      {/* 2. Menu / Categories (Screen 07) */}
      <Tabs.Screen
        name="menu"
        listeners={{
          tabPress: () => triggerHaptic.selection(),
        }}
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="grid"
              outlineName="grid-outline"
              focused={focused}
              color={color}
              size={21}
            />
          ),
        }}
      />

      {/* 3. Saved / Favourites (Screen 11) */}
      <Tabs.Screen
        name="saved"
        listeners={{
          tabPress: () => triggerHaptic.selection(),
        }}
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="heart"
              outlineName="heart-outline"
              focused={focused}
              color={color}
              size={22}
            />
          ),
        }}
      />

      {/* 4. Shopping Cart (Screen 12) */}
      <Tabs.Screen
        name="cart"
        listeners={{
          tabPress: () => triggerHaptic.selection(),
        }}
        options={{
          title: 'Cart',
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: styles.cartBadge,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="bag-handle"
              outlineName="bag-handle-outline"
              focused={focused}
              color={color}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.backgroundSecondary,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 8,
    ...shadows.bottomBar,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  cartBadge: {
    backgroundColor: colors.accent,
    color: colors.textDark,
    fontSize: 10,
    fontWeight: '800',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
  },
});
