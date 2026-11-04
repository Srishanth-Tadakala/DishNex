// ==============================================================================
// EMBER DOMAIN TYPES & DATA CONTRACTS
// ==============================================================================

export type DietaryClassification = 'veg' | 'non-veg' | 'vegan' | 'egg';
export type SpiceLevel = 'mild' | 'medium' | 'spicy' | 'extra_spicy';
export type OrderType = 'dine_in' | 'takeaway' | 'delivery';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'cod';

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'dispatched'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type UserRole = 'customer' | 'staff' | 'manager' | 'owner' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface MenuItemAddon {
  id: string;
  menuItemId: string;
  name: string;
  pricePaise: number;
  isAvailable: boolean;
}

export interface MenuItemOption {
  id: string;
  groupId: string;
  name: string;
  priceDeltaPaise: number;
  isDefault: boolean;
}

export interface MenuItemOptionGroup {
  id: string;
  menuItemId: string;
  name: string;
  minSelectable: number;
  maxSelectable: number;
  isRequired: boolean;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  pricePaise: number; // e.g. 29900 for ₹299
  imageUrl: string;
  dietaryClassification: DietaryClassification;
  spiceLevel: SpiceLevel;
  servingInfo: string; // e.g. "Serves 1-2"
  calories?: number;
  prepTimeMinutes: number;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
  addons?: MenuItemAddon[];
  optionGroups?: MenuItemOptionGroup[];
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  itemCount?: number;
  displayOrder: number;
  isActive: boolean;
}

export interface CartItem {
  id: string; // unique cart entry ID: item.id + selected addons hash
  menuItem: MenuItem;
  quantity: number;
  selectedAddons: MenuItemAddon[];
  specialInstructions?: string;
  unitPricePaise: number;
  totalPricePaise: number;
}

export interface Address {
  id: string;
  userId: string;
  label: 'Home' | 'Work' | 'Other' | string;
  recipientName: string;
  phoneNumber: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmountPaise: number;
  maxDiscountPaise?: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  itemName: string;
  unitPricePaise: number;
  quantity: number;
  totalPricePaise: number;
  selectedAddons?: MenuItemAddon[];
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "#EM683721"
  userId: string;
  restaurantId: string;
  branchId: string;
  orderType: OrderType;
  status: OrderStatus;
  rejectionReason?: string;
  tableIdentifier?: string;
  deliveryAddress?: Address;
  specialInstructions?: string;
  subtotalPaise: number;
  discountPaise: number;
  couponCode?: string;
  taxPaise: number;
  packagingFeePaise: number;
  deliveryFeePaise: number;
  totalPaise: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  estimatedDeliveryTime: string;
  createdAt: string;
  items?: OrderItem[];
}

export interface RestaurantBranch {
  id: string;
  restaurantId: string;
  name: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  isAcceptingOrders: boolean;
  taxRatePercent: number;
  packagingFeePaise: number;
  deliveryFeeBasePaise: number;
}

