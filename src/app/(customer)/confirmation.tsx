// ==============================================================================
// SCREEN 14 — ORDER CONFIRMATION (DishNex Luxury Celebration & State Animations)
// Headline: Order Placed Successfully! 🎉
// Info Card: Order ID #EMB83721 | Estimated Delivery 30-40 mins
// Actions: Track Order (Primary Lime) | Back to Home
// ==============================================================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { DishNexFlameLogo } from '../../components/common/EmberFlameLogo';
import { Button } from '../../components/common/Button';

const { width } = Dimensions.get('window');

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
  const cardSlide = useRef(new Animated.Value(20)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (_) {}

    // 1. Cloche dome spring reveal
    Animated.parallel([
      Animated.timing(clocheOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(clocheScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Checkmark badge pop
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Card slide-up reveal
    Animated.sequence([
      Animated.delay(450),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(cardSlide, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleTrackOrder = () => {
    router.push({
      pathname: '/(customer)/orders/[id]',
      params: { id: orderId || 'ord-683721' },
    });
  };

  const handleBackToHome = () => {
    router.replace('/(customer)/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* 1. Top DishNex Flame Branding */}
      <View style={styles.topBrand}>
        <DishNexFlameLogo size="medium" showTagline={false} />
      </View>

      {/* 2. Cloche Illustration with Animated Green Checkmark & Confetti Accents */}
      <View style={styles.illustrationContainer}>
        {/* Subtle celebratory ambient sparkle dots */}
        <View style={[styles.sparkleDot, { top: -8, left: 16 }]} />
        <View style={[styles.sparkleDot, { top: 12, right: 10, width: 6, height: 6 }]} />
        <View style={[styles.sparkleDot, { bottom: 20, left: -6, width: 5, height: 5 }]} />
        <View style={[styles.sparkleDot, { bottom: 8, right: 18, width: 7, height: 7 }]} />

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
  },
  sparkleDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    opacity: 0.7,
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
