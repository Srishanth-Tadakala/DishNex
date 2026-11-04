// ==============================================================================
// SCREEN 01 — SPLASH SCREEN
// ==============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import { EmberFlameLogo } from '../components/common/EmberFlameLogo';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { hasCompletedOnboarding, isAuthenticated } = useAuthStore();
  const [progress, setProgress] = useState(0.2);

  useEffect(() => {
    // Smooth progress animation simulation
    const timer1 = setTimeout(() => setProgress(0.6), 400);
    const timer2 = setTimeout(() => setProgress(1.0), 900);

    const redirectTimer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.replace('/(customer)/onboarding');
      } else {
        router.replace('/(customer)/(tabs)');
      }
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(redirectTimer);
    };
  }, [hasCompletedOnboarding, isAuthenticated, router]);

  return (
    <View style={styles.container}>
      {/* Background Gradient & Glow */}
      <View style={styles.glowCircle} />

      {/* Top Branding Section */}
      <View style={styles.brandSection}>
        <EmberFlameLogo size="large" showTagline={true} />
      </View>

      {/* Hero Gourmet Sizzle Plate (Screen 1 Reference) */}
      <View style={styles.heroImageContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      {/* Bottom Loading Progress Bar */}
      <View style={styles.footerSection}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.round(progress * 100)}%` },
            ]}
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
    top: '15%',
    width: width * 0.95,
    height: width * 0.95,
    borderRadius: (width * 0.95) / 2,
    backgroundColor: 'rgba(36, 77, 58, 0.20)',
  },
  brandSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  heroImageContainer: {
    width: width * 0.9,
    height: width * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 120,
    height: 4,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
});

