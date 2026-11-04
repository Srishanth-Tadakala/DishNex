// ==============================================================================
// UNIT TESTS: Cart Store & Calculation Logic
// ==============================================================================

import { useCartStore } from '../store/cartStore';
import { MenuItem, MenuItemAddon, Coupon } from '../types';

const sampleBiryani: MenuItem = {
  id: 'm-hyd-chicken-biryani',
  restaurantId: 'rest-1',
  categoryId: 'c-biryani',
  name: 'Hyderabadi Chicken Biryani',
  description: 'Royal aromatic dum biryani',
  pricePaise: 29900, // ₹299
  imageUrl: 'https://example.com/biryani.jpg',
  dietaryClassification: 'non-veg',
  spiceLevel: 'medium',
  servingInfo: 'Serves 1-2',
  calories: 690,
  prepTimeMinutes: 25,
  rating: 4.8,
  reviewsCount: 1200,
  isAvailable: true,
  isFeatured: true,
  displayOrder: 1,
};

const extraChickenAddon: MenuItemAddon = {
  id: 'a-extra-chicken',
  menuItemId: 'm-hyd-chicken-biryani',
  name: 'Extra Chicken',
  pricePaise: 7900, // ₹79
  isAvailable: true,
};

describe('EMBER Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds an item to cart without addons', () => {
    const { addItem, items, getSubtotalPaise } = useCartStore.getState();
    addItem(sampleBiryani, [], 1);

    const updatedState = useCartStore.getState();
    expect(updatedState.items.length).toBe(1);
    expect(updatedState.items[0].quantity).toBe(1);
    expect(updatedState.getSubtotalPaise()).toBe(29900); // ₹299
  });

  it('correctly calculates total when addons are selected', () => {
    const { addItem } = useCartStore.getState();
    // ₹299 + ₹79 = ₹378 (37800 paise)
    addItem(sampleBiryani, [extraChickenAddon], 1);

    const updatedState = useCartStore.getState();
    expect(updatedState.items.length).toBe(1);
    expect(updatedState.items[0].unitPricePaise).toBe(37800);
    expect(updatedState.getSubtotalPaise()).toBe(37800);
  });

  it('increments quantity and updates totals', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(sampleBiryani, [], 1);

    const cartItemId = useCartStore.getState().items[0].id;
    updateQuantity(cartItemId, 3);

    const updatedState = useCartStore.getState();
    expect(updatedState.items[0].quantity).toBe(3);
    expect(updatedState.getSubtotalPaise()).toBe(29900 * 3); // ₹897
  });

  it('removes item when quantity is reduced to 0', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(sampleBiryani, [], 1);

    const cartItemId = useCartStore.getState().items[0].id;
    updateQuantity(cartItemId, 0);

    const updatedState = useCartStore.getState();
    expect(updatedState.items.length).toBe(0);
    expect(updatedState.getSubtotalPaise()).toBe(0);
  });

  it('applies coupon and recalculates total', () => {
    const { addItem, applyCoupon } = useCartStore.getState();
    addItem(sampleBiryani, [], 2); // 2 * 29900 = 59800 paise (₹598)

    const coupon: Coupon = {
      id: 'c1',
      code: 'WELCOME50',
      description: '50% off up to ₹150',
      discountType: 'percentage',
      discountValue: 50,
      minOrderAmountPaise: 29900,
      maxDiscountPaise: 15000, // ₹150
    };

    const applied = applyCoupon(coupon);
    expect(applied).toBe(true);

    const updatedState = useCartStore.getState();
    expect(updatedState.getDiscountPaise()).toBe(15000); // capped at ₹150
  });

  it('prevents adding out-of-stock items to cart', () => {
    const outOfStockBiryani: MenuItem = {
      ...sampleBiryani,
      id: 'm-oos-biryani',
      isAvailable: false,
    };

    const { addItem } = useCartStore.getState();
    addItem(outOfStockBiryani, [], 1);

    const updatedState = useCartStore.getState();
    expect(updatedState.items.length).toBe(0);
    expect(updatedState.getSubtotalPaise()).toBe(0);
  });

  it('drops coupon discount when subtotal falls below minimum spend requirement', () => {
    const { addItem, updateQuantity, applyCoupon } = useCartStore.getState();
    addItem(sampleBiryani, [], 2); // 2 * 299 = ₹598

    const coupon: Coupon = {
      id: 'c2',
      code: 'EMBERFEST',
      description: 'Flat ₹100 off on orders over ₹500',
      discountType: 'flat',
      discountValue: 10000,
      minOrderAmountPaise: 50000, // ₹500
    };

    applyCoupon(coupon);
    expect(useCartStore.getState().getDiscountPaise()).toBe(10000);

    // Reduce quantity to 1 -> Subtotal becomes ₹299 (below ₹500 min)
    const cartItemId = useCartStore.getState().items[0].id;
    updateQuantity(cartItemId, 1);

    expect(useCartStore.getState().getSubtotalPaise()).toBe(29900);
    expect(useCartStore.getState().getDiscountPaise()).toBe(0); // Strict enforcement
  });
});

