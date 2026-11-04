// ==============================================================================
// EMBER CART STORE — STATE & MONETARY CALCULATIONS (Zustand + AsyncStorage)
// All pricing is strictly calculated in integer paise with persistent storage.
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, MenuItem, MenuItemAddon, OrderType, Coupon } from '../types';
import { calculateTaxPaise, calculateDiscountPaise } from '../utils/currency';

interface CartState {
  items: CartItem[];
  orderType: OrderType;
  selectedBranchId: string;
  appliedCoupon: Coupon | null;
  specialInstructions: string;
  tableIdentifier: string;

  // Actions
  addItem: (menuItem: MenuItem, selectedAddons?: MenuItemAddon[], quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setTableIdentifier: (table: string) => void;
  applyCoupon: (coupon: Coupon) => boolean;
  removeCoupon: () => void;
  setSpecialInstructions: (instructions: string) => void;

  // Computations (returned in integer paise)
  getSubtotalPaise: () => number;
  getDiscountPaise: () => number;
  getTaxPaise: () => number;
  getPackagingFeePaise: () => number;
  getDeliveryFeePaise: () => number;
  getTotalPaise: () => number;
  getItemCount: () => number;
}

// Generate deterministic ID based on item ID and sorted addon IDs
function generateCartItemId(menuItemId: string, addons: MenuItemAddon[]): string {
  if (!addons || addons.length === 0) return menuItemId;
  const sortedAddonIds = addons.map((a) => a.id).sort().join('_');
  return `${menuItemId}__${sortedAddonIds}`;
}

const INITIAL_REFERENCE_ITEMS: CartItem[] = [
  {
    id: 'm-hyd-chicken-biryani',
    menuItem: {
      id: 'm-hyd-chicken-biryani',
      restaurantId: 'e0000000-0000-0000-0000-000000000001',
      categoryId: 'c-biryani',
      name: 'Hyderabadi Chicken Biryani',
      description:
        'A royal blend of aromatic basmati rice, tender chicken, and authentic Hyderabadi spices.',
      pricePaise: 29900,
      imageUrl:
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
      dietaryClassification: 'non-veg',
      spiceLevel: 'medium',
      prepTimeMinutes: 25,
      isAvailable: true,
      isFeatured: true,
      displayOrder: 1,
      rating: 4.8,
      reviewsCount: 1240,
      servingInfo: 'Serves 1-2',
      calories: 690,
    },
    selectedAddons: [],
    quantity: 1,
    unitPricePaise: 29900,
    totalPricePaise: 29900,
  },
  {
    id: 'm-paneer-butter-masala',
    menuItem: {
      id: 'm-paneer-butter-masala',
      restaurantId: 'e0000000-0000-0000-0000-000000000001',
      categoryId: 'c-main-course',
      name: 'Paneer Butter Masala',
      description:
        'Cottage cheese cubes simmered in a velvety tomato, butter, and cashew cream gravy.',
      pricePaise: 29900,
      imageUrl:
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80',
      dietaryClassification: 'veg',
      spiceLevel: 'mild',
      prepTimeMinutes: 20,
      isAvailable: true,
      isFeatured: false,
      displayOrder: 2,
      rating: 4.7,
      reviewsCount: 890,
      servingInfo: 'Serves 1-2',
      calories: 520,
    },
    selectedAddons: [],
    quantity: 1,
    unitPricePaise: 29900,
    totalPricePaise: 29900,
  },
  {
    id: 'm-choco-lava-cake',
    menuItem: {
      id: 'm-choco-lava-cake',
      restaurantId: 'e0000000-0000-0000-0000-000000000001',
      categoryId: 'c-desserts',
      name: 'Chocolate Lava Cake',
      description:
        'Warm, decadent dark chocolate cake with a molten, oozing chocolate core.',
      pricePaise: 19900,
      imageUrl:
        'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
      dietaryClassification: 'veg',
      spiceLevel: 'mild',
      prepTimeMinutes: 15,
      isAvailable: true,
      isFeatured: false,
      displayOrder: 3,
      rating: 4.9,
      reviewsCount: 1520,
      servingInfo: 'Serves 1',
      calories: 450,
    },
    selectedAddons: [],
    quantity: 1,
    unitPricePaise: 19900,
    totalPricePaise: 19900,
  },
];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: INITIAL_REFERENCE_ITEMS,
      orderType: 'delivery',
      selectedBranchId: 'b0000000-0000-0000-0000-000000000001',
      appliedCoupon: null,
      specialInstructions: '',
      tableIdentifier: '',

      addItem: (menuItem, selectedAddons = [], quantity = 1) => {
        // Guard against adding out-of-stock items
        if (!menuItem.isAvailable) {
          console.warn(`Cannot add unavailable item: ${menuItem.name}`);
          return;
        }

        const cartItemId = generateCartItemId(menuItem.id, selectedAddons);
        const addonsTotalPaise = selectedAddons.reduce((sum, a) => sum + a.pricePaise, 0);
        const unitPricePaise = menuItem.pricePaise + addonsTotalPaise;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === cartItemId);
          if (existingIndex > -1) {
            const updated = [...state.items];
            const existing = updated[existingIndex];
            const newQty = Math.min(50, existing.quantity + quantity);
            updated[existingIndex] = {
              ...existing,
              quantity: newQty,
              totalPricePaise: unitPricePaise * newQty,
            };
            return { items: updated };
          }

          const newItem: CartItem = {
            id: cartItemId,
            menuItem,
            quantity: Math.min(50, Math.max(1, quantity)),
            selectedAddons,
            unitPricePaise,
            totalPricePaise: unitPricePaise * quantity,
          };

          return { items: [...state.items, newItem] };
        });
      },

      updateQuantity: (cartItemId, newQuantity) => {
        set((state) => {
          if (newQuantity <= 0) {
            return { items: state.items.filter((item) => item.id !== cartItemId) };
          }
          const cappedQty = Math.min(50, newQuantity);
          return {
            items: state.items.map((item) =>
              item.id === cartItemId
                ? {
                    ...item,
                    quantity: cappedQty,
                    totalPricePaise: item.unitPricePaise * cappedQty,
                  }
                : item
            ),
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, specialInstructions: '' });
      },

      setOrderType: (type) => {
        set({ orderType: type });
      },

      setTableIdentifier: (table) => {
        set({ tableIdentifier: table });
      },

      applyCoupon: (coupon) => {
        const subtotal = get().getSubtotalPaise();
        if (subtotal < coupon.minOrderAmountPaise) {
          return false;
        }
        set({ appliedCoupon: coupon });
        return true;
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      setSpecialInstructions: (instructions) => {
        set({ specialInstructions: instructions });
      },

      getSubtotalPaise: () => {
        return get().items.reduce((sum, item) => sum + item.totalPricePaise, 0);
      },

      getDiscountPaise: () => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;
        const subtotal = get().getSubtotalPaise();
        return calculateDiscountPaise(
          subtotal,
          appliedCoupon.discountType,
          appliedCoupon.discountValue,
          appliedCoupon.maxDiscountPaise,
          appliedCoupon.minOrderAmountPaise
        );
      },

      getTaxPaise: () => {
        const subtotal = get().getSubtotalPaise();
        const discount = get().getDiscountPaise();
        const taxableAmount = Math.max(0, subtotal - discount);
        // 5.0% GST on net taxable subtotal
        return calculateTaxPaise(taxableAmount, 5.0);
      },

      getPackagingFeePaise: () => {
        const { items, orderType } = get();
        if (items.length === 0 || orderType === 'dine_in') return 0;
        return 0; // Promoted free packaging for flagship launch
      },

      getDeliveryFeePaise: () => {
        const { items, orderType } = get();
        if (items.length === 0 || orderType !== 'delivery') return 0;
        return 0; // Free delivery promo
      },

      getTotalPaise: () => {
        const subtotal = get().getSubtotalPaise();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountPaise();
        const tax = get().getTaxPaise();
        const packaging = get().getPackagingFeePaise();
        const delivery = get().getDeliveryFeePaise();

        return Math.max(0, subtotal - discount + tax + packaging + delivery);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'ember-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        orderType: state.orderType,
        appliedCoupon: state.appliedCoupon,
        specialInstructions: state.specialInstructions,
        tableIdentifier: state.tableIdentifier,
      }),
    }
  )
);
