// ==============================================================================
// SCREENS 02, 03, 04 — ONBOARDING FLOW (DishNex Brand & Fluid Page Transitions)
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../theme/colors';
import { radii, spacing, shadows } from '../../../theme/spacing';
import { DishNexFlameLogo } from '../../../components/common/EmberFlameLogo';
import { useAuthStore } from '../../../store/authStore';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  headline: string;
  subtitle: string;
  imageUrl: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    headline: 'A Premium\nDining Experience\nin Your Pocket',
    subtitle:
      'Explore menus, order your favourites, and enjoy restaurant food, your way.',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80', // Ambient fine dining interior
  },
  {
    id: '2',
    headline: 'Discover\nIrresistible Menus',
    subtitle:
      'From signature dishes to chef specials — explore a world of flavours.',
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80', // Gourmet burger
  },
  {
    id: '3',
    headline: 'Order\nSeamlessly',
    subtitle: 'Dine in, takeaway or delivery with just a few taps.',
    imageUrl:
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&q=80', // Chef plating
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { step } = useLocalSearchParams<{ step?: string }>();
  const initialIndex = step ? parseInt(step, 10) : 0;
  const { setOnboardingCompleted } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(
    isNaN(initialIndex) || initialIndex < 0 || initialIndex > 2 ? 0 : initialIndex
  );

  // Transition animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  const currentSlide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  useEffect(() => {
    // Entrance animation when slide changes
    fadeAnim.setValue(0);
    slideAnim.setValue(15);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const handleFinish = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (_) {}
    setOnboardingCompleted(true);
    router.replace('/(customer)/(tabs)');
  };

  const handleNext = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (_) {}

    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    if (isLast) {
      handleFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  return (
    <View style={styles.container}>
      {/* Hero Photography with Dark Emerald Gradient Scrim */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: currentSlide.imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.scrimTop} />
        <View style={styles.scrimBottom} />

        {/* Small Flame Branding Header (Screen 2 Reference) */}
        <View style={styles.headerBrand}>
          <DishNexFlameLogo size="small" showTagline={false} />
        </View>
      </View>

      {/* Editorial Text Content with Smooth Animated Fade */}
      <Animated.View
        style={[
          styles.contentSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.headline}>{currentSlide.headline}</Text>
        <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
      </Animated.View>

      {/* Footer Navigation: Skip | 3-dot pagination | Next / Get Started button */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Pagination Dots with Luminous Lime Active Indicator */}
        <View style={styles.paginationDots}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.85}
            style={styles.nextButton}
            accessibilityRole="button"
            accessibilityLabel={isLast ? 'Get Started' : 'Next slide'}
          >
            <Text style={styles.nextButtonText}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
            {!isLast && (
              <Ionicons
                name="arrow-forward"
                size={16}
                color={colors.textDark}
                style={styles.nextIcon}
              />
            )}
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
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    height: height * 0.52,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  scrimTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(7, 26, 20, 0.45)',
  },
  scrimBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: colors.background,
  },
  headerBrand: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  contentSection: {
    paddingHorizontal: spacing.xxl,
    flex: 1,
    justifyContent: 'center',
  },
  headline: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 38,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingBottom: 48,
  },
  skipText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 22,
    backgroundColor: colors.accent,
    ...shadows.accent,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: colors.surfaceSecondary,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    ...shadows.accent,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  nextIcon: {
    marginLeft: 6,
  },
});
