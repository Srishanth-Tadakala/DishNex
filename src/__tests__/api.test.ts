// ==============================================================================
// INTEGRATION TESTS: Unified API Service & Order Flow
// ==============================================================================

import { api } from '../services/api';
import { MOCK_MENU_ITEMS, MOCK_SAVED_ADDRESSES } from '../services/mockData';

describe('EMBER Unified API Layer', () => {
  it('retrieves categories successfully', async () => {
    const categories = await api.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.some((c) => c.slug === 'biryani')).toBe(true);
  });

  it('filters menu items by dietary preference', async () => {
    const vegItems = await api.getMenuItems(undefined, 'veg');
    expect(vegItems.every((i) => i.dietaryClassification === 'veg')).toBe(true);

    const nonVegItems = await api.getMenuItems(undefined, 'non-veg');
    expect(nonVegItems.every((i) => i.dietaryClassification === 'non-veg')).toBe(true);
  });

  it('searches dishes by keyword', async () => {
    const searchResults = await api.searchDishes('biryani');
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.every((i) => i.name.toLowerCase().includes('biryani'))).toBe(true);
  });

  it('creates customer order transactionally with valid #EM format', async () => {
    const order = await api.createOrder({
      userId: 'user-test-01',
      orderType: 'delivery',
      deliveryAddress: MOCK_SAVED_ADDRESSES[0],
      items: [
        {
          menuItem: MOCK_MENU_ITEMS[0],
          quantity: 2,
          selectedAddons: [],
        },
      ],
      subtotalPaise: 59800,
      discountPaise: 0,
      taxPaise: 2990,
      packagingFeePaise: 0,
      deliveryFeePaise: 0,
      totalPaise: 62790,
      paymentMethod: 'upi',
    });

    expect(order).toBeDefined();
    expect(order.orderNumber).toMatch(/^#EM\d{6}$/);
    expect(order.status).toBe('placed');
    expect(order.totalPaise).toBe(62790);
  });

  it('correctly calculates order items unitPricePaise and total when addons are included', async () => {
    const itemWithAddon = MOCK_MENU_ITEMS[0]; // Hyderabadi Biryani (29900)
    const extraChicken = itemWithAddon.addons![0]; // Extra Chicken (7900)

    const order = await api.createOrder({
      userId: 'user-test-01',
      orderType: 'delivery',
      items: [
        {
          menuItem: itemWithAddon,
          quantity: 2,
          selectedAddons: [extraChicken],
        },
      ],
      subtotalPaise: (29900 + 7900) * 2, // 75600
      discountPaise: 0,
      taxPaise: 3780,
      packagingFeePaise: 0,
      deliveryFeePaise: 0,
      totalPaise: 75600 + 3780,
      paymentMethod: 'upi',
    });

    expect(order.items![0].unitPricePaise).toBe(37800); // 29900 + 7900
    expect(order.items![0].totalPricePaise).toBe(75600); // 37800 * 2
  });

  it('updates order status through kitchen workflow', async () => {
    const orders = await api.getStaffOrders();
    const targetOrder = orders[0];

    const updated = await api.updateOrderStatus(targetOrder.id, 'preparing');
    expect(updated.status).toBe('preparing');
  });

  it('toggles menu item 86 availability', async () => {
    const item = MOCK_MENU_ITEMS[0];
    const toggled = await api.toggleMenuItemStock(item.id, false);
    expect(toggled.isAvailable).toBe(false);

    // Toggle back
    const restored = await api.toggleMenuItemStock(item.id, true);
    expect(restored.isAvailable).toBe(true);
  });
});

