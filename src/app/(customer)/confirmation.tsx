// ==============================================================================
// SCREEN 14 — ORDER CONFIRMATION (Industry-Grade Luxury Specification)
// Headline: Order Placed Successfully! 🎉
// Ambient Aura, Staggered Celebratory Sparkles & Physical Spring Revelations
// ==============================================================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { triggerHaptic } from '../../theme/animations';
import { DishNexFlameLogo } from '../../components/common/EmberFlameLogo';
import { Button } from '../../components/common/Button';

const { width } = Dimensions.get('window');

// 8 celebratory particles in 360-degree radial coordinates
const CELEBRATION_PARTICLES = [
  { angle: 30, dist: 86, color: colors.accent, size: 7 },
  { angle: 75, dist: 94, color: colors.gold, size: 6 },
  { angle: 120, dist: 82, color: colors.success, size: 8 },
  { angle: 165, dist: 90, color: colors.accent, size: 5 },
  { angle: 210, dist: 88, color: colors.gold, size: 7 },
  { angle: 255, dist: 96, color: colors.success, size: 6 },
  { angle: 300, dist: 84, color: colors.accent, size: 8 },
  { angle: 345, dist: 92, color: colors.gold, size: 5 },
];

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId, orderNumber, estimatedTime } = useLocalSearchParams<{
    orderId?: string;
    orderNumber?: string;
    estimatedTime?: string;
  }>();

  const displayOrderNumber = orderNumber || '#EMB83721';
  const displayEstimatedTime = estimatedTime || '30 - 40 mins';

  // Animation values
  const clocheScale = useRef(new Animated.Value(0.6)).current;
  const clocheOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;
  const particleBurst = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(24)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    triggerHaptic.success();

    // 1. Cloche dome spring reveal
    Animated.parallel([
      Animated.timing(clocheOpacity, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(clocheScale, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Checkmark badge pop & particle burst
    Animated.sequence([
      Animated.delay(260),
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 3.5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.spring(particleBurst, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Card slide-up reveal
    Animated.sequence([
      Animated.delay(420),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.spring(cardSlide, {
          toValue: 0,
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 4. Subtle pulsating ambient ring loop
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1.28,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.5,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const handleTrackOrder = () => {
    triggerHaptic.light();
    router.push({
      pathname: '/(customer)/orders/[id]',
      params: { id: orderId || 'ord-683721' },
    });
  };

  const handleBackToHome = () => {
    triggerHaptic.light();
    router.replace('/(customer)/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* 1. Top DishNex Flame Branding */}
      <View style={styles.topBrand}>
        <DishNexFlameLogo size="medium" showTagline={false} />
      </View>

      {/* 2. Cloche Illustration with Animated Green Checkmark & Radial Particle Burst */}
      <View style={styles.illustrationContainer}>
        {/* Pulsating ambient ring */}
        <Animated.View
          style={[
            styles.ambientRing,
            {
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
            },
          ]}
        />

        {/* 360-degree Celebratory Sparkle Particles */}
        {CELEBRATION_PARTICLES.map((p, idx) => {
          const rad = (p.angle * Math.PI) / 180;
          const targetX = Math.cos(rad) * p.dist;
          const targetY = Math.sin(rad) * p.dist;

          return (
            <Animated.View
              key={idx}
              style={[
                styles.particle,
                {
                  width: p.size,
                  height: p.size,
                  borderRadius: p.size / 2,
                  backgroundColor: p.color,
                  transform: [
                    {
                      translateX: particleBurst.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, targetX],
                      }),
                    },
                    {
                      translateY: particleBurst.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, targetY],
                      }),
                    },
                    {
                      scale: particleBurst.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 1.3, 1],
                      }),
                    },
                  ],
                  opacity: particleBurst.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0, 1, 0.85],
                  }),
                },
              ]}
            />
          );
        })}

        <Animated.View
          style={[
            styles.clocheCircle,
            {
              opacity: clocheOpacity,
              transform: [{ scale: clocheScale }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="room-service"
            size={76}
            color={colors.accent}
          />
          {/* Green checkmark badge with pop animation */}
          <Animated.View
            style={[
              styles.checkBadge,
              { transform: [{ scale: checkScale }] },
            ]}
          >
            <Ionicons name="checkmark" size={24} color={colors.textDark} />
          </Animated.View>
        </Animated.View>
      </View>

      {/* 3. Success Headline & Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.headline}>Order Placed Successfully! 🎉</Text>
        <Text style={styles.subtitle}>
          Your food is being prepared with care. You'll get live updates shortly.
        </Text>
      </View>

      {/* 4. Order ID & Estimated Delivery Info Card with Slide-Up Entrance */}
      <Animated.View
        style={[
          styles.infoCard,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardSlide }],
          },
        ]}
      >
        <View style={styles.infoColLeft}>
          <Text style={styles.infoLabel}>Order ID</Text>
          <Text style={styles.infoValueLeft}>{displayOrderNumber}</Text>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.infoColRight}>
          <Text style={styles.infoLabel}>Estimated Delivery</Text>
          <Text style={styles.infoValueRight}>{displayEstimatedTime}</Text>
        </View>
      </Animated.View>

      {/* 5. Bottom Actions (Track Order & Back to Home) */}
      <View style={styles.actionsContainer}>
        <Button
          title="Track Order"
          onPress={handleTrackOrder}
          style={styles.trackButton}
        />

        <TouchableOpacity
          onPress={handleBackToHome}
          activeOpacity={0.7}
          style={styles.homeButton}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xxl,
    paddingTop: 60,
    paddingBottom: 48,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBrand: {
    alignItems: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
    position: 'relative',
    width: 220,
    height: 220,
  },
  ambientRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  particle: {
    position: 'absolute',
    ...shadows.accent,
  },
  clocheCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadows.cardElevated,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    ...shadows.accent,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  headline: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.card,
  },
  infoColLeft: {
    flex: 1,
  },
  infoColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.md,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValueLeft: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  infoValueRight: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.accent,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  trackButton: {
    marginBottom: spacing.md,
  },
  homeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  homeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
