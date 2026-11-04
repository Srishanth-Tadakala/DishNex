// ==============================================================================
// SCREEN 14 — ORDER CONFIRMATION (Exact Reference Screen 14 Layout)
// Headline: Order Placed Successfully! 🎉
// Info Card: Order ID #EM683721 | Estimated Delivery 30-40 mins
// Actions: Track Order (Primary Lime) | Back to Home
// ==============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { EmberFlameLogo } from '../../components/common/EmberFlameLogo';
import { Button } from '../../components/common/Button';

const { width } = Dimensions.get('window');

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId, orderNumber, estimatedTime } = useLocalSearchParams<{
    orderId?: string;
    orderNumber?: string;
    estimatedTime?: string;
  }>();

  const displayOrderNumber = orderNumber || '#EM683721';
  const displayEstimatedTime = estimatedTime || '30 - 40 mins';

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
      {/* 1. Top EMBER Flame Branding */}
      <View style={styles.topBrand}>
        <EmberFlameLogo size="medium" showTagline={false} />
      </View>

      {/* 2. Cloche Illustration with Green Checkmark */}
      <View style={styles.illustrationContainer}>
        <View style={styles.clocheCircle}>
          <MaterialCommunityIcons
            name="room-service"
            size={76}
            color={colors.accent}
          />
          {/* Green checkmark badge */}
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={24} color={colors.textDark} />
          </View>
        </View>
      </View>

      {/* 3. Success Headline & Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.headline}>Order Placed Successfully! 🎉</Text>
        <Text style={styles.subtitle}>
          Your food is being prepared with care. You'll get live updates shortly.
        </Text>
      </View>

      {/* 4. Order ID & Estimated Delivery Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoColLeft}>
          <Text style={styles.infoLabel}>Order ID</Text>
          <Text style={styles.infoValueLeft}>{displayOrderNumber}</Text>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.infoColRight}>
          <Text style={styles.infoLabel}>Estimated Delivery</Text>
          <Text style={styles.infoValueRight}>{displayEstimatedTime}</Text>
        </View>
      </View>

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
    ...shadows.card,
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

