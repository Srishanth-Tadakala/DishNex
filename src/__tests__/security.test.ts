// ==============================================================================
// EMBER AUTOMATED SECURITY REGRESSION TEST SUITE
// Tests: Price tampering, BOLA, RBAC, idempotency replay, coupon validation, stock enforcement
// ==============================================================================

import { api } from '../services/api';
import { MOCK_MENU_ITEMS, MOCK_COUPONS } from '../services/mockData';
import { OrderType, PaymentMethod } from '../types';

describe('EMBER Application Security Assurance Suite', () => {
  const sampleDish = MOCK_MENU_ITEMS[0]; // Hyderabadi Chicken Biryani (₹299 / 29900 paise)

  describe('1. Client-Side Price Tampering Prevention', () => {
    it('should ignore client-manipulated totalPaise and strictly enforce authoritative server total', async () => {
      // Attacker sends manipulated client total of 100 paise (₹1) for a ₹299 item
      const manipulatedOrder = await api.createOrder({
        userId: 'user-attacker-01',
        orderType: 'dine_in',
        items: [
          {
            menuItem: sampleDish,
            quantity: 1,
            selectedAddons: [],
          },
        ],
        subtotalPaise: 100, // Tampered
        discountPaise: 0,
        taxPaise: 5,        // Tampered
        packagingFeePaise: 0,
        deliveryFeePaise: 0,
        totalPaise: 105,    // Tampered: Attacker tries to pay ₹1.05
        paymentMethod: 'upi',
      });

      // The authoritative subtotal is ₹299 (29900 paise)
      expect(manipulatedOrder.subtotalPaise).toBe(29900);
      // Authoritative GST 5% on 29900 is 1495 paise (₹14.95 -> 1495)
      expect(manipulatedOrder.taxPaise).toBe(1495);
      // Authoritative total must be 29900 + 1495 = 31395 paise (₹313.95)
      expect(manipulatedOrder.totalPaise).toBe(31395);
      // Must not match attacker's falsified total
      expect(manipulatedOrder.totalPaise).not.toBe(105);
    });

    it('should reject orders containing out-of-stock items', async () => {
      const outOfStockDish = {
        ...sampleDish,
        id: 'm-out-of-stock',
        name: 'Sold Out Truffle Pasta',
        isAvailable: false,
      };

      await expect(
        api.createOrder({
          userId: 'user-victim-01',
          orderType: 'takeaway',
          items: [{ menuItem: outOfStockDish, quantity: 1, selectedAddons: [] }],
          subtotalPaise: 29900,
          discountPaise: 0,
          taxPaise: 1495,
          packagingFeePaise: 0,
          deliveryFeePaise: 0,
          totalPaise: 31395,
          paymentMethod: 'card',
        })
      ).rejects.toThrow(/out of stock/i);
    });

    it('should reject invalid or extreme quantities (overflow/underflow attacks)', async () => {
      // Zero quantity
      await expect(
        api.createOrder({
          userId: 'user-test-01',
          orderType: 'dine_in',
          items: [{ menuItem: sampleDish, quantity: 0, selectedAddons: [] }],
          subtotalPaise: 0,
          discountPaise: 0,
          taxPaise: 0,
          packagingFeePaise: 0,
          deliveryFeePaise: 0,
          totalPaise: 0,
          paymentMethod: 'cod',
        })
      ).rejects.toThrow(/invalid item quantity/i);

      // Excessive quantity (DoS attempt)
      await expect(
        api.createOrder({
          userId: 'user-test-01',
          orderType: 'dine_in',
          items: [{ menuItem: sampleDish, quantity: 51, selectedAddons: [] }],
          subtotalPaise: 0,
          discountPaise: 0,
          taxPaise: 0,
          packagingFeePaise: 0,
          deliveryFeePaise: 0,
          totalPaise: 0,
          paymentMethod: 'cod',
        })
      ).rejects.toThrow(/invalid item quantity/i);
    });
  });

  describe('2. Coupon Exploitation & Minimum Spend Guard', () => {
    it('should reject applying coupon when subtotal does not satisfy minimum order spend', async () => {
      // EMBER50 requires ₹500 (50000 paise) min order. Sample dish is ₹299 (29900 paise).
      const order = await api.createOrder({
        userId: 'user-coupon-test',
        orderType: 'dine_in',
        couponCode: 'EMBER50',
        items: [{ menuItem: sampleDish, quantity: 1, selectedAddons: [] }],
        subtotalPaise: 29900,
        discountPaise: 5000, // Attacker tries to inject ₹50 discount
        taxPaise: 1245,
        packagingFeePaise: 0,
        deliveryFeePaise: 0,
        totalPaise: 26145,
        paymentMethod: 'upi',
      });

      // Discount must be rejected because 29900 < 50000 min order
      expect(order.discountPaise).toBe(0);
      expect(order.totalPaise).toBe(29900 + 1495);
    });
  });

  describe('3. Cross-Tenant Idempotency & Replay Attack Defense', () => {
    it('should reject when an attacker attempts to replay another customer idempotency key', async () => {
      const victimIdempotencyKey = `idem_victim_${Date.now()}`;

      // 1. Legitimate user Alice places order
      const aliceOrder = await api.createOrder({
        userId: 'user-alice',
        orderType: 'dine_in',
        idempotencyKey: victimIdempotencyKey,
        items: [{ menuItem: sampleDish, quantity: 1, selectedAddons: [] }],
        subtotalPaise: 29900,
        discountPaise: 0,
        taxPaise: 1495,
        packagingFeePaise: 0,
        deliveryFeePaise: 0,
        totalPaise: 31395,
        paymentMethod: 'upi',
      });
      expect(aliceOrder).toBeDefined();

      // 2. Attacker Bob tries to replay Alice's idempotency key
      await expect(
        api.createOrder({
          userId: 'user-bob-attacker',
          orderType: 'dine_in',
          idempotencyKey: victimIdempotencyKey,
          items: [{ menuItem: sampleDish, quantity: 1, selectedAddons: [] }],
          subtotalPaise: 29900,
          discountPaise: 0,
          taxPaise: 1495,
          packagingFeePaise: 0,
          deliveryFeePaise: 0,
          totalPaise: 31395,
          paymentMethod: 'upi',
        })
      ).rejects.toThrow(/idempotency conflict/i);
    });
  });

  describe('4. Broken Object-Level Authorization (BOLA / IDOR) Defense', () => {
    it('should prevent an unprivileged customer from accessing another customer order by ID', async () => {
      // Alice creates an order
      const aliceOrder = await api.createOrder({
        userId: 'user-alice-private',
        orderType: 'takeaway',
        items: [{ menuItem: sampleDish, quantity: 1, selectedAddons: [] }],
        subtotalPaise: 29900,
        discountPaise: 0,
        taxPaise: 1495,
        packagingFeePaise: 0,
        deliveryFeePaise: 0,
        totalPaise: 31395,
        paymentMethod: 'card',
      });

      // Bob (another customer) tries to inspect Alice's order
      await expect(
        api.getOrderById(aliceOrder.id, 'user-bob-eavesdropper', 'customer')
      ).rejects.toThrow(/access denied/i);

      // Alice can successfully access her own order
      const accessedByAlice = await api.getOrderById(aliceOrder.id, 'user-alice-private', 'customer');
      expect(accessedByAlice).toBeDefined();
      expect(accessedByAlice?.id).toBe(aliceOrder.id);

      // Authorized Staff can also access the order
      const accessedByStaff = await api.getOrderById(aliceOrder.id, 'user-staff-01', 'staff');
      expect(accessedByStaff).toBeDefined();
    });

    it('should isolate customer orders list so users cannot fetch arbitrary user order histories', async () => {
      const aliceOrders = await api.getUserOrders('user-victim-history', 'user-attacker-requester', 'customer');
      // When attacker requests victim's orders, tenant isolation scopes to the attacker's own ID
      aliceOrders.forEach((o) => {
        expect(o.userId).toBe('user-attacker-requester');
      });
    });
  });

  describe('5. Role-Based Access Control (RBAC) on Staff Operations', () => {
    it('should deny unauthorized customers from accessing the staff operations order queue', async () => {
      await expect(api.getStaffOrders('customer')).rejects.toThrow(/access denied.*staff/i);
    });

    it('should permit authorized staff and managers to access the operations queue', async () => {
      const staffOrders = await api.getStaffOrders('staff');
      expect(Array.isArray(staffOrders)).toBe(true);

      const managerOrders = await api.getStaffOrders('manager');
      expect(Array.isArray(managerOrders)).toBe(true);
    });

    it('should deny regular customers from modifying order statuses', async () => {
      const order = await api.createOrder({
        userId: 'user-customer-test',
        orderType: 'dine_in',
        items: [{ menuItem: sampleDish, quantity: 1, selectedAddons: [] }],
        subtotalPaise: 29900,
        discountPaise: 0,
        taxPaise: 1495,
        packagingFeePaise: 0,
        deliveryFeePaise: 0,
        totalPaise: 31395,
        paymentMethod: 'cod',
      });

      await expect(
        api.updateOrderStatus(order.id, 'completed', undefined, 'customer')
      ).rejects.toThrow(/access denied.*staff/i);
    });

    it('should permit authorized staff to transition order statuses', async () => {
      const order = await api.createOrder({
        userId: 'user-lifecycle-test',
        orderType: 'dine_in',
        items: [{ menuItem: sampleDish, quantity: 1, selectedAddons: [] }],
        subtotalPaise: 29900,
        discountPaise: 0,
        taxPaise: 1495,
        packagingFeePaise: 0,
        deliveryFeePaise: 0,
        totalPaise: 31395,
        paymentMethod: 'cod',
      });

      const updated = await api.updateOrderStatus(order.id, 'confirmed', undefined, 'staff');
      expect(updated.status).toBe('confirmed');
    });

    it('should deny non-managers from toggling menu item stock availability', async () => {
      await expect(
        api.toggleMenuItemStock(sampleDish.id, false, 'customer')
      ).rejects.toThrow(/access denied.*manager/i);

      await expect(
        api.toggleMenuItemStock(sampleDish.id, false, 'staff')
      ).rejects.toThrow(/access denied.*manager/i);
    });

    it('should permit restaurant managers to toggle menu item stock availability', async () => {
      const toggled = await api.toggleMenuItemStock(sampleDish.id, false, 'manager');
      expect(toggled.isAvailable).toBe(false);

      // Re-enable
      const restored = await api.toggleMenuItemStock(sampleDish.id, true, 'owner');
      expect(restored.isAvailable).toBe(true);
    });
  });
});

