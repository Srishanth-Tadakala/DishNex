// ==============================================================================
// SCREEN 01 — SPLASH SCREEN (DishNex Brand Reveal & Fluid Ambient Animation)
// ==============================================================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import { DishNexFlameLogo } from '../components/common/EmberFlameLogo';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { hasCompletedOnboarding, isAuthenticated } = useAuthStore();

  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0.15)).current;
  const glowPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Logo flame reveal & scale spring
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Hero food plate entrance
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(heroTranslateY, {
        toValue: 0,
        friction: 7,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Subtle ambient glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1.15,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 4. Progress bar fill animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // 5. Seamless navigation transition
    const redirectTimer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.replace('/(customer)/onboarding');
      } else {
        router.replace('/(customer)/(tabs)');
      }
    }, 1500);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [hasCompletedOnboarding, isAuthenticated, router]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background Ambient Glow Circles */}
      <Animated.View
        style={[
          styles.glowCircle,
          { transform: [{ scale: glowPulse }] },
        ]}
      />

      {/* Top Branding Section with Animated Logo Reveal */}
      <Animated.View
        style={[
          styles.brandSection,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <DishNexFlameLogo size="large" showTagline={true} />
      </Animated.View>

      {/* Hero Gourmet Sizzle Plate (Screen 1 Reference) */}
      <Animated.View
        style={[
          styles.heroImageContainer,
          {
            opacity: heroOpacity,
            transform: [{ translateY: heroTranslateY }],
          },
        ]}
      >
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Bottom Loading Progress Bar with Lime Illumination */}
      <View style={styles.footerSection}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBarFill, { width: progressWidth }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  glowCircle: {
    position: 'absolute',
    top: '12%',
    width: width * 0.95,
    height: width * 0.95,
    borderRadius: (width * 0.95) / 2,
    backgroundColor: 'rgba(72, 199, 131, 0.12)',
  },
  brandSection: {
    marginTop: 25,
    alignItems: 'center',
  },
  heroImageContainer: {
    width: width * 0.92,
    height: width * 0.92,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: (width * 0.92) / 2,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  footerSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBarBackground: {
    width: 130,
    height: 4,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});
