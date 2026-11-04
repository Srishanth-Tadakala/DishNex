// ==============================================================================
// LIVE ORDER TRACKING SCREEN (Part 5.5 Specification)
// Real-time timeline: Placed -> Confirmed -> Preparing -> Out for Delivery -> Delivered
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { radii, spacing, shadows } from '../../../theme/spacing';
import { Header } from '../../../components/common/Header';
import { Button } from '../../../components/common/Button';
import { formatPaise } from '../../../utils/currency';
import { api } from '../../../services/api';
import { Order, OrderStatus } from '../../../types';

const STATUS_STEPS: Array<{ key: OrderStatus; label: string; icon: string }> = [
  { key: 'placed', label: 'Order Placed', icon: 'receipt-outline' },
  { key: 'confirmed', label: 'Confirmed by Kitchen', icon: 'checkmark-circle-outline' },
  { key: 'preparing', label: 'Chef Preparing Your Food', icon: 'restaurant-outline' },
  { key: 'ready', label: 'Ready / Dispatched', icon: 'bicycle-outline' },
  { key: 'completed', label: 'Delivered / Completed', icon: 'sparkles-outline' },
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      const orderData = await api.getOrderById(id || 'ord-683721');
      if (orderData) {
        setOrder(orderData);
      }
    }
    fetchOrder();

    // Polling simulation for realtime updates
    const interval = setInterval(fetchOrder, 4000);
    return () => clearInterval(interval);
  }, [id]);

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Locating your order...</Text>
      </View>
    );
  }

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
      case 'dispatched':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.status);

  return (
    <View style={styles.container}>
      <Header
        title={`Track ${order.orderNumber}`}
        showBack={true}
        onBack={() => router.back()}
        style={styles.header}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Highlight Banner */}
        <View style={styles.statusBanner}>
          <MaterialCommunityIcons
            name="chef-hat"
            size={32}
            color={colors.accent}
          />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerHeadline}>
              {order.status === 'completed'
                ? 'Order Delivered! 🎉'
                : 'Preparing With Culinary Precision'}
            </Text>
            <Text style={styles.bannerEstimated}>
              Est. Arrival: {order.estimatedDeliveryTime}
            </Text>
          </View>
        </View>

        {/* Step-by-Step Vertical Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>Live Kitchen Updates</Text>

          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isLast = idx === STATUS_STEPS.length - 1;

            return (
              <View key={step.key} style={styles.timelineRow}>
                {/* Left indicator column */}
                <View style={styles.indicatorCol}>
                  <View
                    style={[
                      styles.circle,
                      isCompleted && styles.circleCompleted,
                      isCurrent && styles.circleCurrent,
                    ]}
                  >
                    <Ionicons
                      name={
                        isCompleted
                          ? 'checkmark'
                          : (step.icon as any)
                      }
                      size={14}
                      color={
                        isCompleted || isCurrent
                          ? colors.textDark
                          : colors.textMuted
                      }
                    />
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.connector,
                        isCompleted && styles.connectorCompleted,
                      ]}
                    />
                  )}
                </View>

                {/* Right text description */}
                <View style={styles.stepTextContainer}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isCurrent && styles.stepTitleCurrent,
                    ]}
                  >
                    {step.label}
                  </Text>
                  {isCurrent && (
                    <Text style={styles.stepSubtitle}>
                      Our culinary artisans are working on your dum preparation.
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Order Items Breakdown */}
        <View style={styles.itemsCard}>
          <Text style={styles.cardTitle}>Ordered Items</Text>
          {order.items?.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.quantity}x {item.itemName}
              </Text>
              <Text style={styles.itemPrice}>
                {formatPaise(item.totalPricePaise)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>{formatPaise(order.totalPaise)}</Text>
          </View>
        </View>

        {/* Support Help Button */}
        <Button
          title="Need Help with this Order?"
          variant="secondary"
          onPress={() => router.push('/(customer)/support')}
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 48,
    height: 96,
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  bannerTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  bannerHeadline: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bannerEstimated: {
    fontSize: 12,
    color: colors.accent,
    marginTop: 2,
    fontWeight: '600',
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 52,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 30,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  circleCompleted: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  circleCurrent: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    marginVertical: 2,
  },
  connectorCompleted: {
    backgroundColor: colors.accent,
  },
  stepTextContainer: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingBottom: spacing.md,
  },
  stepTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  stepTitleCurrent: {
    color: colors.accent,
    fontWeight: '700',
  },
  stepSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  itemsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.accent,
  },
});

