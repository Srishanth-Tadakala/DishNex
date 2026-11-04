// ==============================================================================
// SCREENS 02, 03, 04 — ONBOARDING FLOW
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/spacing';
import { EmberFlameLogo } from '../../../components/common/EmberFlameLogo';
import { useAuthStore } from '../../../store/authStore';
import { Ionicons } from '@expo/vector-icons';

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

  const currentSlide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  const handleFinish = () => {
    setOnboardingCompleted(true);
    router.replace('/(customer)/(tabs)');
  };

  const handleNext = () => {
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

        {/* Small Flame Branding Header */}
        <View style={styles.headerBrand}>
          <EmberFlameLogo size="small" showTagline={false} />
        </View>
      </View>

      {/* Editorial Text Content */}
      <View style={styles.contentSection}>
        <Text style={styles.headline}>{currentSlide.headline}</Text>
        <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
      </View>

      {/* Footer Navigation: Skip | 3-dot pagination | Next / Get Started button */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Pagination Dots */}
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
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          style={styles.nextButton}
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
    backgroundColor: 'rgba(6, 19, 15, 0.4)',
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
    width: 20,
    backgroundColor: colors.accent,
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

