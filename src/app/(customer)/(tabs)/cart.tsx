// ==============================================================================
// SCREEN 12 — SHOPPING CART (Exact Reference Screen 12 Layout)
// Subtotal ₹797 + Taxes (5%) ₹40 = Total ₹837
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { radii, spacing, shadows } from '../../../theme/spacing';
import { Header } from '../../../components/common/Header';
import { QuantityStepper } from '../../../components/common/QuantityStepper';
import { Button } from '../../../components/common/Button';
import { formatPaise } from '../../../utils/currency';
import { useCartStore } from '../../../store/cartStore';
import { MOCK_MENU_ITEMS, MOCK_COUPONS } from '../../../services/mockData';

export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    clearCart,
    addItem,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotalPaise,
    getTaxPaise,
    getDiscountPaise,
    getPackagingFeePaise,
    getDeliveryFeePaise,
    getTotalPaise,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // If user visits empty cart, pre-populate with the 3 exact items from the visual reference
  const loadReferenceItems = () => {
    // 1. Hyderabadi Chicken Biryani (₹299)
    const biryani = MOCK_MENU_ITEMS.find((i) => i.id === 'm-hyd-chicken-biryani')!;
    // 2. Paneer Butter Masala (₹299)
    const paneer = MOCK_MENU_ITEMS.find((i) => i.id === 'm-paneer-butter-masala')!;
    // 3. Chocolate Lava Cake (₹199)
    const cake = MOCK_MENU_ITEMS.find((i) => i.id === 'm-choco-lava-cake')!;

    clearCart();
    addItem(biryani, [], 1);
    addItem(paneer, [], 1);
    addItem(cake, [], 1);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const coupon = MOCK_COUPONS.find(
      (c) => c.code.toUpperCase() === couponInput.toUpperCase().trim()
    );
    if (!coupon) {
      setCouponError('Invalid promo code');
      return;
    }
    const success = applyCoupon(coupon);
    if (!success) {
      setCouponError(`Min order amount is ${formatPaise(coupon.minOrderAmountPaise)}`);
    } else {
      setCouponInput('');
    }
  };

  const subtotalPaise = getSubtotalPaise();
  const taxPaise = getTaxPaise();
  const discountPaise = getDiscountPaise();
  const packagingFeePaise = getPackagingFeePaise();
  const deliveryFeePaise = getDeliveryFeePaise();
  const totalPaise = getTotalPaise();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title={`Your Cart (${items.reduce((s, i) => s + i.quantity, 0)})`}
        showBack={true}
        onBack={() => router.back()}
        rightIcon={items.length > 0 ? 'trash-outline' : undefined}
        onRightPress={clearCart}
        style={styles.header}
      />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={64}
            color={colors.textMuted}
          />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>
            Explore our curated menu and add fine gourmet selections.
          </Text>

          <Button
            title="Load Reference Feast (3 Items)"
            variant="outline"
            onPress={loadReferenceItems}
            style={styles.loadSampleButton}
          />
          <Button
            title="Explore Menu"
            onPress={() => router.push('/(customer)/(tabs)/menu')}
            style={{ marginTop: 12 }}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Cart Item Cards */}
          <View style={styles.itemsList}>
            {items.map((cartItem) => (
              <View key={cartItem.id} style={styles.itemCard}>
                <Image
                  source={{ uri: cartItem.menuItem.imageUrl }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {cartItem.menuItem.name}
                  </Text>
                  {cartItem.selectedAddons.length > 0 && (
                    <Text style={styles.addonText} numberOfLines={1}>
                      + {cartItem.selectedAddons.map((a) => a.name).join(', ')}
                    </Text>
                  )}
                  <Text style={styles.itemPrice}>
                    {formatPaise(cartItem.unitPricePaise)}
                  </Text>
                </View>

                {/* Quantity Stepper */}
                <QuantityStepper
                  quantity={cartItem.quantity}
                  onIncrement={() =>
                    updateQuantity(cartItem.id, cartItem.quantity + 1)
                  }
                  onDecrement={() =>
                    updateQuantity(cartItem.id, cartItem.quantity - 1)
                  }
                  size="small"
                />
              </View>
            ))}
          </View>

          {/* Coupon Section */}
          <View style={styles.couponContainer}>
            <View style={styles.couponRow}>
              <MaterialCommunityIcons
                name="ticket-percent-outline"
                size={22}
                color={colors.accent}
                style={styles.couponIcon}
              />
              <TextInput
                placeholder="Apply Coupon"
                placeholderTextColor={colors.textMuted}
                value={couponInput}
                onChangeText={setCouponInput}
                style={styles.couponInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                onPress={handleApplyCoupon}
                activeOpacity={0.7}
              >
                <Text style={styles.viewOffersText}>Apply</Text>
              </TouchableOpacity>
            </View>

            {couponError ? (
              <Text style={styles.couponErrorText}>{couponError}</Text>
            ) : null}

            {appliedCoupon ? (
              <View style={styles.appliedRow}>
                <Text style={styles.appliedText}>
                  Code '{appliedCoupon.code}' applied! (-{formatPaise(discountPaise)})
                </Text>
                <TouchableOpacity onPress={removeCoupon}>
                  <Ionicons name="close-circle" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setCouponInput('WELCOME50')}
                style={styles.suggestPromo}
              >
                <Text style={styles.promoHint}>
                  Tap to use: <Text style={{ color: colors.accent }}>WELCOME50</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Bill Summary (Matches Screen 12: Subtotal ₹797, Taxes 5% ₹40, Total ₹837) */}
          <View style={styles.billCard}>
            <Text style={styles.billTitle}>Bill Summary</Text>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>{formatPaise(subtotalPaise)}</Text>
            </View>

            {discountPaise > 0 && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: colors.success }]}>
                  Coupon Discount
                </Text>
                <Text style={[styles.billValue, { color: colors.success }]}>
                  -{formatPaise(discountPaise)}
                </Text>
              </View>
            )}

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes (5%)</Text>
              <Text style={styles.billValue}>{formatPaise(taxPaise)}</Text>
            </View>

            {packagingFeePaise > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Packaging Fee</Text>
                <Text style={styles.billValue}>{formatPaise(packagingFeePaise)}</Text>
              </View>
            )}

            {deliveryFeePaise > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Text style={styles.billValue}>{formatPaise(deliveryFeePaise)}</Text>
              </View>
            )}

            <View style={styles.billDivider} />

            <View style={styles.billRow}>
              <Text style={styles.billTotalLabel}>Total</Text>
              <Text style={styles.billTotalValue}>{formatPaise(totalPaise)}</Text>
            </View>
          </View>

          {/* Proceed to Checkout CTA */}
          <Button
            title="Proceed to Checkout"
            iconRight="arrow-forward"
            onPress={() => router.push('/(customer)/checkout')}
            style={styles.checkoutButton}
          />
        </ScrollView>
      )}
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
  itemsList: {
    marginBottom: spacing.lg,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceSecondary,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  addonText: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  couponContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponIcon: {
    marginRight: spacing.sm,
  },
  couponInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  viewOffersText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  couponErrorText: {
    color: colors.error,
    fontSize: 11,
    marginTop: 6,
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  appliedText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  suggestPromo: {
    marginTop: 6,
  },
  promoHint: {
    fontSize: 11,
    color: colors.textMuted,
  },
  billCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  billTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  billDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.md,
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  billTotalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.accent,
  },
  checkoutButton: {
    marginBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  loadSampleButton: {
    marginBottom: spacing.sm,
  },
});

