// ==============================================================================
// SCREEN 13 — CHECKOUT (Exact Reference Screen 13 Layout & Fluid Stepper)
// Stepper: Address -> Payment -> Confirm
// Delivery Address: Marwadi University, Rajkot, Gujarat - 360003
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { formatPaise } from '../../utils/currency';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { paymentService } from '../../services/payments';
import { Address, OrderType, PaymentMethod } from '../../types';

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    orderType,
    setOrderType,
    tableIdentifier,
    specialInstructions,
    getSubtotalPaise,
    getTaxPaise,
    getDiscountPaise,
    getPackagingFeePaise,
    getDeliveryFeePaise,
    getTotalPaise,
    clearCart,
  } = useCartStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchAddresses() {
      const list = await api.getAddresses(user?.id || 'user-siddu-01');
      setAddresses(list);
      setSelectedAddress(list[0] || null);
    }
    fetchAddresses();
  }, [user]);

  const totalPaise = getTotalPaise();

  const handleTypeSelect = (type: OrderType) => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
    } catch (_) {}
    setOrderType(type);
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
    } catch (_) {}
    setPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      router.push('/(customer)/(tabs)/cart');
      return;
    }

    setIsProcessing(true);
    try {
      try {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (_) {}

      const idempotencyKey = `ord_idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // 1. Payment Initialization / Session via Razorpay service boundary
      const paymentResult = await paymentService.createPaymentSession({
        orderId: `ord_draft_${Date.now()}`,
        orderNumber: '#EM_DRAFT',
        amountPaise: totalPaise,
        customerName: user?.fullName || 'Siddu',
        customerEmail: user?.email || 'siddu@dishnex.luxury',
        customerPhone: user?.phoneNumber || '+91 98765 43210',
      });

      if (!paymentResult.success) {
        alert(paymentResult.error || 'Payment failed to initialize');
        setIsProcessing(false);
        return;
      }

      // 2. Transactional Order Creation via backend API
      const createdOrder = await api.createOrder({
        userId: user?.id || 'user-siddu-01',
        orderType,
        tableIdentifier: orderType === 'dine_in' ? tableIdentifier || 'Table 4' : undefined,
        deliveryAddress: selectedAddress || undefined,
        specialInstructions,
        couponCode: useCartStore.getState().appliedCoupon?.code,
        idempotencyKey,
        items: items.map((i) => ({
          menuItem: i.menuItem,
          quantity: i.quantity,
          selectedAddons: i.selectedAddons,
        })),
        subtotalPaise: getSubtotalPaise(),
        discountPaise: getDiscountPaise(),
        taxPaise: getTaxPaise(),
        packagingFeePaise: getPackagingFeePaise(),
        deliveryFeePaise: getDeliveryFeePaise(),
        totalPaise,
        paymentMethod,
      });

      // 3. Clear cart and navigate to Screen 14 (Order Confirmation)
      clearCart();
      router.replace({
        pathname: '/(customer)/confirmation',
        params: {
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          estimatedTime: createdOrder.estimatedDeliveryTime,
        },
      });
    } catch (e: any) {
      alert(e.message || 'Error creating order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Checkout"
        showBack={true}
        onBack={() => router.back()}
        style={styles.header}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Step Indicator (Address -> Payment -> Confirm) */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepActive]}>
              <Ionicons name="checkmark" size={14} color={colors.textDark} />
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Address</Text>
          </View>
          <View style={[styles.stepLine, styles.stepLineActive]} />

          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepActive]}>
              <Text style={styles.stepNumberActive}>2</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Payment</Text>
          </View>
          <View style={styles.stepLine} />

          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Confirm</Text>
          </View>
        </View>

        {/* 2. Delivery Address Card (Marwadi University, Rajkot, Gujarat - 360003) */}
        <View style={styles.sectionCardIvory}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitleDark}>Delivery Address</Text>
            <TouchableOpacity
              onPress={() => router.push('/(customer)/addresses')}
              accessibilityRole="button"
              accessibilityLabel="Change delivery address"
            >
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressRow}>
            <View style={styles.iconCircleIvory}>
              <Ionicons name="home-outline" size={20} color={colors.textDark} />
            </View>
            <View style={styles.addressDetails}>
              <Text style={styles.addressLabelDark}>
                {selectedAddress?.label || 'Home'}
              </Text>
              <Text style={styles.addressTextDark} numberOfLines={2}>
                {selectedAddress?.streetAddress ||
                  'Marwadi University, Rajkot, Gujarat - 360003'}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Delivery Type Selector (Dine In / Takeaway / Delivery) */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Delivery Type</Text>
          <View style={styles.typeSelectorRow}>
            {/* Dine In */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTypeSelect('dine_in')}
              style={[
                styles.typeButton,
                orderType === 'dine_in' && styles.typeButtonActive,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: orderType === 'dine_in' }}
            >
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={22}
                color={
                  orderType === 'dine_in' ? colors.textDark : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.typeButtonText,
                  orderType === 'dine_in' && styles.typeButtonTextActive,
                ]}
              >
                Dine In
              </Text>
            </TouchableOpacity>

            {/* Takeaway */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTypeSelect('takeaway')}
              style={[
                styles.typeButton,
                orderType === 'takeaway' && styles.typeButtonActive,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: orderType === 'takeaway' }}
            >
              <MaterialCommunityIcons
                name="shopping-outline"
                size={22}
                color={
                  orderType === 'takeaway' ? colors.textDark : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.typeButtonText,
                  orderType === 'takeaway' && styles.typeButtonTextActive,
                ]}
              >
                Takeaway
              </Text>
            </TouchableOpacity>

            {/* Delivery */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTypeSelect('delivery')}
              style={[
                styles.typeButton,
                orderType === 'delivery' && styles.typeButtonActive,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: orderType === 'delivery' }}
            >
              <MaterialCommunityIcons
                name="moped"
                size={24}
                color={
                  orderType === 'delivery' ? colors.textDark : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.typeButtonText,
                  orderType === 'delivery' && styles.typeButtonTextActive,
                ]}
              >
                Delivery
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Delivery Time */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Delivery Time</Text>
            <TouchableOpacity>
              <Text style={styles.scheduleLink}>Schedule</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="time-outline" size={20} color={colors.accent} />
            </View>
            <View style={styles.addressDetails}>
              <Text style={styles.addressLabel}>As soon as possible</Text>
              <Text style={styles.addressText}>~30-40 mins</Text>
            </View>
          </View>
        </View>

        {/* 5. Payment Method */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Payment Method</Text>

          {/* UPI */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handlePaymentSelect('upi')}
            style={[
              styles.paymentOption,
              paymentMethod === 'upi' && styles.paymentOptionActive,
            ]}
          >
            <View style={styles.paymentLeft}>
              <MaterialCommunityIcons
                name="cellphone-check"
                size={22}
                color={colors.accent}
              />
              <View style={{ marginLeft: spacing.md }}>
                <Text style={styles.paymentTitle}>
                  UPI (Google Pay, PhonePe, etc.)
                </Text>
                <Text style={styles.paymentSub}>Fast & Instant Pay</Text>
              </View>
            </View>
            <Ionicons
              name={
                paymentMethod === 'upi'
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={20}
              color={paymentMethod === 'upi' ? colors.accent : colors.textMuted}
            />
          </TouchableOpacity>

          {/* Cards */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handlePaymentSelect('card')}
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionActive,
            ]}
          >
            <View style={styles.paymentLeft}>
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={22}
                color={colors.textSecondary}
              />
              <View style={{ marginLeft: spacing.md }}>
                <Text style={styles.paymentTitle}>Credit / Debit Cards</Text>
                <Text style={styles.paymentSub}>Visa, MasterCard, RuPay</Text>
              </View>
            </View>
            <Ionicons
              name={
                paymentMethod === 'card'
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={20}
              color={paymentMethod === 'card' ? colors.accent : colors.textMuted}
            />
          </TouchableOpacity>

          {/* Cash on Delivery (COD) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handlePaymentSelect('cod')}
            style={[
              styles.paymentOption,
              paymentMethod === 'cod' && styles.paymentOptionActive,
            ]}
          >
            <View style={styles.paymentLeft}>
              <MaterialCommunityIcons
                name="cash-fast"
                size={22}
                color={colors.textSecondary}
              />
              <View style={{ marginLeft: spacing.md }}>
                <Text style={styles.paymentTitle}>Cash on Delivery (COD)</Text>
                <Text style={styles.paymentSub}>Pay upon arrival</Text>
              </View>
            </View>
            <Ionicons
              name={
                paymentMethod === 'cod'
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={20}
              color={paymentMethod === 'cod' ? colors.accent : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* 6. Pay Action Button */}
        <Button
          title={`Pay ${formatPaise(totalPaise)}`}
          iconRight="arrow-forward"
          onPress={handlePlaceOrder}
          loading={isProcessing}
          style={styles.payButton}
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    ...shadows.accent,
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  stepNumberActive: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textDark,
  },
  stepLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: colors.textPrimary,
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepLineActive: {
    backgroundColor: colors.accent,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  sectionCardIvory: {
    backgroundColor: '#FFF8EA',
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    marginBottom: spacing.lg,
    ...shadows.cardElevated,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  cardHeaderTitleDark: {
    fontSize: 15,
    fontWeight: '700',
    color: '#071A14',
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#24563B',
  },
  scheduleLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconCircleIvory: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFE9DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  addressDetails: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addressLabelDark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#071A14',
  },
  addressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  addressTextDark: {
    fontSize: 12,
    color: '#4A5B50',
    marginTop: 2,
    lineHeight: 18,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.lg,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  typeButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    ...shadows.accent,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 4,
  },
  typeButtonTextActive: {
    color: colors.textDark,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  paymentOptionActive: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceElevated,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  paymentSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  payButton: {
    marginTop: spacing.md,
    marginBottom: 40,
  },
});
