// ==============================================================================
// DISHNEX — MOCK DATASET (100% Visual Reference Aligned)
// ==============================================================================

import { MenuCategory, MenuItem, Address, Coupon, Order } from '../types';

export const MOCK_RESTAURANT = {
  id: 'e0000000-0000-0000-0000-000000000001',
  name: 'DishNex',
  tagline: 'Discover. Dine. Delight.',
  description: 'A luxury fine-dining sanctuary offering modern Indian gastronomy, dum-cooked biryanis, and artisanal confections.',
  logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80',
  currency: 'INR',
};

export const MOCK_BRANCH = {
  id: 'b0000000-0000-0000-0000-000000000001',
  restaurantId: MOCK_RESTAURANT.id,
  name: 'DishNex Flagship — Rajkot',
  addressLine: 'Marwadi University Road, Gauridad',
  city: 'Rajkot',
  state: 'Gujarat',
  postalCode: '360003',
  phoneNumber: '+91 98765 43210',
  isAcceptingOrders: true,
  taxRatePercent: 5.0,
  packagingFeePaise: 4000, // ₹40
  deliveryFeeBasePaise: 0,  // Free delivery promo
};

export const MOCK_CATEGORIES: MenuCategory[] = [
  {
    id: 'c-biryani',
    name: 'Biryani',
    slug: 'biryani',
    description: 'Aromatic dum-cooked basmati rice with tender spices',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
    itemCount: 12,
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'c-starters',
    name: 'Starters',
    slug: 'starters',
    description: 'Crispy, smoky appetisers from the charcoal tandoor',
    imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&q=80',
    itemCount: 18,
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'c-main-course',
    name: 'Main Course',
    slug: 'main-course',
    description: 'Rich, velvety gravies simmered with heirloom spices',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80',
    itemCount: 24,
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'c-desserts',
    name: 'Desserts',
    slug: 'desserts',
    description: 'Decadent artisanal sweets and molten confections',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    itemCount: 10,
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'c-beverages',
    name: 'Beverages',
    slug: 'beverages',
    description: 'Botanical mocktails, craft shakes and coolers',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80',
    itemCount: 14,
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'c-combos',
    name: 'Combos',
    slug: 'combos',
    description: 'Curated multi-course platters for dining bliss',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80',
    itemCount: 8,
    displayOrder: 6,
    isActive: true,
  },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  // 1. Hyderabadi Chicken Biryani (Screens 8, 9, 10, 11, 12)
  {
    id: 'm-hyd-chicken-biryani',
    restaurantId: MOCK_RESTAURANT.id,
    categoryId: 'c-biryani',
    name: 'Hyderabadi Chicken Biryani',
    description: 'A royal blend of aromatic basmati rice, tender chicken, and authentic Hyderabadi spices, slow-cooked to perfection.',
    pricePaise: 29900, // ₹299
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
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
    addons: [
      {
        id: 'a-extra-chicken',
        menuItemId: 'm-hyd-chicken-biryani',
        name: 'Extra Chicken',
        pricePaise: 7900, // ₹79
        isAvailable: true,
      },
      {
        id: 'a-extra-raita',
        menuItemId: 'm-hyd-chicken-biryani',
        name: 'Extra Raita & Salan',
        pricePaise: 3900, // ₹39
        isAvailable: true,
      },
      {
        id: 'a-boiled-egg',
        menuItemId: 'm-hyd-chicken-biryani',
        name: 'Boiled Egg (2 pcs)',
        pricePaise: 4000, // ₹40
        isAvailable: true,
      },
    ],
  },
  // 2. Mutton Biryani (Screens 8, 10)
  {
    id: 'm-mutton-biryani',
    restaurantId: MOCK_RESTAURANT.id,
    categoryId: 'c-biryani',
    name: 'Mutton Biryani',
    description: 'Slow-braised succulent goat meat layered with saffron-infused long grain rice and caramelized onions.',
    pricePaise: 39900, // ₹399
    imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80',
    dietaryClassification: 'non-veg',
    spiceLevel: 'spicy',
    servingInfo: 'Serves 1-2',
    calories: 780,
    prepTimeMinutes: 30,
    rating: 4.7,
    reviewsCount: 896,
    isAvailable: true,
    isFeatured: false,
    displayOrder: 2,
    addons: [
      {
        id: 'a-extra-mutton',
        menuItemId: 'm-mutton-biryani',
        name: 'Extra Mutton Pieces (2 pcs)',
        pricePaise: 11900,
        isAvailable: true,
      },
    ],
  },
  // 3. Paneer Biryani (Screens 8, 10)
  {
    id: 'm-paneer-biryani',
    restaurantId: MOCK_RESTAURANT.id,
    categoryId: 'c-biryani',
    name: 'Paneer Biryani',
    description: 'Charcoal-grilled cottage cheese cubes simmered in spiced basmati rice with mint and brown onions.',
    pricePaise: 27900, // ₹279
    imageUrl: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&q=80',
    dietaryClassification: 'veg',
    spiceLevel: 'medium',
    servingInfo: 'Serves 1-2',
    calories: 620,
    prepTimeMinutes: 20,
    rating: 4.6,
    reviewsCount: 412,
    isAvailable: true,
    isFeatured: false,
    displayOrder: 3,
    addons: [
      {
        id: 'a-extra-paneer',
        menuItemId: 'm-paneer-biryani',
        name: 'Extra Paneer Cubes',
        pricePaise: 6900,
        isAvailable: true,
      },
    ],
  },
  // 4. Special Family Biryani (Serves 3) (Screens 8, 10)
  {
    id: 'm-family-biryani',
    restaurantId: MOCK_RESTAURANT.id,
    categoryId: 'c-biryani',
    name: 'Special Family Biryani (Serves 3)',
    description: 'Grand feast platter containing double portions of royal spiced chicken, boiled eggs, and salan gravy.',
    pricePaise: 84900, // ₹849
    imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80',
    dietaryClassification: 'non-veg',
    spiceLevel: 'medium',
    servingInfo: 'Serves 3-4',
    calories: 1850,
    prepTimeMinutes: 35,
    rating: 4.9,
    reviewsCount: 2100,
    isAvailable: true,
    isFeatured: true,
    displayOrder: 4,
  },
  // 5. Paneer Butter Masala (Screens 11, 12)
  {
    id: 'm-paneer-butter-masala',
    restaurantId: MOCK_RESTAURANT.id,
    categoryId: 'c-main-course',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes bathed in a velvety makhani sauce infused with fresh butter, cream, and kasuri methi.',
    pricePaise: 29900, // ₹299
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    dietaryClassification: 'veg',
    spiceLevel: 'mild',
    servingInfo: 'Serves 1-2',
    calories: 540,
    prepTimeMinutes: 20,
    rating: 4.7,
    reviewsCount: 730,
    isAvailable: true,
    isFeatured: true,
    displayOrder: 5,
    addons: [
      {
        id: 'a-butter-naan',
        menuItemId: 'm-paneer-butter-masala',
        name: 'Butter Naan (2 pcs)',
        pricePaise: 6000,
        isAvailable: true,
      },
    ],
  },
  // 6. Chocolate Lava Cake (Screens 11, 12)
  {
    id: 'm-choco-lava-cake',
    restaurantId: MOCK_RESTAURANT.id,
    categoryId: 'c-desserts',
    name: 'Chocolate Lava Cake',
    description: 'Warm Belgian dark chocolate cake with a molten truffle centre, served with vanilla bean cream.',
    pricePaise: 19900, // ₹199
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
    dietaryClassification: 'veg',
    spiceLevel: 'mild',
    servingInfo: 'Serves 1',
    calories: 420,
    prepTimeMinutes: 15,
    rating: 4.9,
    reviewsCount: 580,
    isAvailable: true,
    isFeatured: true,
    displayOrder: 6,
  },
  // 7. Mango Shake (Screen 11)
  {
    id: 'm-mango-shake',
    restaurantId: MOCK_RESTAURANT.id,
    categoryId: 'c-beverages',
    name: 'Mango Shake',
    description: 'Pure Alphonso mango pulp blended with whole milk and topped with chopped pistachios.',
    pricePaise: 14900, // ₹149
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80',
    dietaryClassification: 'veg',
    spiceLevel: 'mild',
    servingInfo: 'Serves 1',
    calories: 280,
    prepTimeMinutes: 10,
    rating: 4.6,
    reviewsCount: 320,
    isAvailable: true,
    isFeatured: false,
    displayOrder: 7,
  },
  // 8. Chef's Signature Plate (Today's Special - Screen 6)
  {
    id: 'm-chefs-signature-plate',
    restaurantId: MOCK_RESTAURANT.id,
    categoryId: 'c-combos',
    name: "Chef's Signature Plate",
    description: 'A curated meal crafted with seasonal ingredients, smoked tandoori cutlets, saffron pulao, and signature accompaniments.',
    pricePaise: 49900, // ₹499
    imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&q=80',
    dietaryClassification: 'non-veg',
    spiceLevel: 'medium',
    servingInfo: 'Serves 1-2',
    calories: 710,
    prepTimeMinutes: 25,
    rating: 4.9,
    reviewsCount: 950,
    isAvailable: true,
    isFeatured: true,
    displayOrder: 8,
  },
];

export const MOCK_SAVED_ADDRESSES: Address[] = [
  {
    id: 'addr-home',
    userId: 'user-siddu-01',
    label: 'Home',
    recipientName: 'Siddu',
    phoneNumber: '+91 98765 43210',
    streetAddress: 'Marwadi University, Rajkot, Gujarat - 360003',
    city: 'Rajkot',
    state: 'Gujarat',
    postalCode: '360003',
    isDefault: true,
  },
  {
    id: 'addr-work',
    userId: 'user-siddu-01',
    label: 'Work',
    recipientName: 'Siddu',
    phoneNumber: '+91 98765 43210',
    streetAddress: 'Cyber Heights, Innovation Hub, 4th Floor',
    city: 'Rajkot',
    state: 'Gujarat',
    postalCode: '360005',
    isDefault: false,
  },
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'coup-welcome50',
    code: 'WELCOME50',
    description: '50% off up to ₹150 on your luxury feast',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmountPaise: 29900,
    maxDiscountPaise: 15000,
  },
  {
    id: 'coup-dishnex',
    code: 'DISHNEX',
    description: 'Flat ₹100 off on gourmet orders over ₹500',
    discountType: 'flat',
    discountValue: 10000,
    minOrderAmountPaise: 50000,
  },
];

export const MOCK_INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-683721',
    orderNumber: '#EM683721',
    userId: 'user-siddu-01',
    restaurantId: MOCK_RESTAURANT.id,
    branchId: MOCK_BRANCH.id,
    orderType: 'delivery',
    status: 'preparing',
    deliveryAddress: MOCK_SAVED_ADDRESSES[0],
    subtotalPaise: 79700, // ₹797
    discountPaise: 0,
    taxPaise: 4000,      // ₹40 (approx 5%)
    packagingFeePaise: 0,
    deliveryFeePaise: 0,
    totalPaise: 83700,    // ₹837
    paymentStatus: 'captured',
    paymentMethod: 'upi',
    estimatedDeliveryTime: '30-40 mins',
    createdAt: new Date().toISOString(),
    items: [
      {
        id: 'oi-1',
        orderId: 'ord-683721',
        menuItemId: 'm-hyd-chicken-biryani',
        itemName: 'Hyderabadi Chicken Biryani',
        unitPricePaise: 29900,
        quantity: 1,
        totalPricePaise: 29900,
      },
      {
        id: 'oi-2',
        orderId: 'ord-683721',
        menuItemId: 'm-paneer-butter-masala',
        itemName: 'Paneer Butter Masala',
        unitPricePaise: 29900,
        quantity: 1,
        totalPricePaise: 29900,
      },
      {
        id: 'oi-3',
        orderId: 'ord-683721',
        menuItemId: 'm-choco-lava-cake',
        itemName: 'Chocolate Lava Cake',
        unitPricePaise: 19900,
        quantity: 1,
        totalPricePaise: 19900,
      },
    ],
  },
];

