# DishNex — Discover. Dine. Delight.

> A luxury digital restaurant platform combining fine-dining elegance with industry-grade ordering, real-time kitchen operations, and secure payments.

---

## 🌟 Visual Authority & Luxury Experience
**DishNex** delivers an uncompromising, fine-dining digital sanctuary. Designed against the strict 14-screen luxury specification, DishNex features:
- **Obsidian & Deep Emerald Surfaces** (`#06130F`, `#0B1D15`, `#10271D`, `#193629`)
- **Luminous Haute Chartreuse & Lime Interactive Elements** (`#D8F06B`, `#B7E44F`)
- **Warm Flame Amber & Star Gold** (`#F5C042`, `#F08A4B`)
- **Tactile Culinary Paper Surfaces** (`#F4F0E7`, `#EDE8DD`)
- **Warm Editorial Typography** (`Playfair Display`, `Manrope`, `Georgia`, serif)
- **Glassmorphic Depth, Spring Motion & Micro-Interactions**:
  - Gliding spring indicator segmented selector with specular highlights.
  - Multi-stop LinearGradient primary action buttons with top hairline sheen.
  - Multi-stage heart bounce animations with sensory haptic feedback.
  - 360-degree celebratory radial particle burst & pulsating cloche dome ring on order confirmation.
  - Interactive stepper bump counters and card-level spring physics.

---

## 📱 The 14 Core Customer Screens
1. **Splash Screen**: Luminous flame logo animation, dark emerald backdrop, DishNex wordmark reveal, and progress indicator.
2. **Onboarding — Dining**: Luxury dining room hero, headline *"A Premium Dining Experience in Your Pocket"*.
3. **Onboarding — Discovery**: Floating gourmet burger, headline *"Discover Irresistible Menus"*.
4. **Onboarding — Ordering**: Chef plating hero, headline *"Order Seamlessly"*, Get Started CTA.
5. **Authentication**: Segmented Sign In / Sign Up, input focus glow, password visibility toggle, social auth options.
6. **Home / Discover**: Personalized greeting (`Good Evening, Siddu 👋`), search, order mode selector (Dine In / Takeaway / Delivery), Today's Special Chef's Plate, Categories, Emerald bottom nav.
7. **Menu / Categories**: 2-Column interactive grid (Biryani, Starters, Main Course, Desserts, Beverages, Combos) with Veg/Non-Veg filters.
8. **Category Menu List**: Biryani category list with ratings, reviews, pricing, dietary indicators, favorite toggle with spring bounce, and quick add-to-cart.
9. **Food Details**: Full-screen hero image, spice level, portion serving cloche, calorie count, add-ons (Extra Chicken +₹79), quantity stepper, and live pricing button.
10. **Search**: Live search across names, ingredients, categories, trending searches, and query history.
11. **Saved / Favourites**: Dedicated screen isolating saved dishes with direct add-to-cart actions.
12. **Shopping Cart**: Itemized bill with customization breakdowns, quantity steppers, coupon redemption, GST tax breakdown, and checkout action.
13. **Checkout**: Multi-step checkout pipeline, saved address picker, delivery mode selection, scheduling, and UPI/Card payment selection.
14. **Order Confirmation**: Cloche illustration with green verification badge & celebratory sparkles, generated order number (`#EMB83721`), estimated delivery time, and live order tracking.

---

## 👨‍🍳 Operational Restaurant Staff Mode
DishNex includes a role-protected staff mode (`owner`, `manager`, `chef`, `staff`):
- **Live Staff Dashboard**: Real-time kitchen throughput, pending orders, active kitchen queue, and daily revenue.
- **Kitchen Display System (KDS)**: Real-time order status lifecycle transitions:
  `Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Dispatched / Completed`.
- **Menu Administration**: On-the-fly 86/stock availability toggling, price editing, and add-on configuration.

---

## 🛠️ Technology Stack
- **Frontend Framework**: React Native + Expo SDK 52 (TypeScript Strict Mode)
- **Routing**: Expo Router v4 (File-based navigation)
- **State Architecture**:
  - `Zustand`: Ephemeral cart, order type, and client preferences.
  - `TanStack Query`: Server state caching, deduplication, and background synchronization.
  - `AsyncStorage` & `SecureStore`: Persistent device cache and authentication sessions.
- **Backend & Database**: Supabase (PostgreSQL 15+, Row Level Security, Realtime WebSockets, PL/pgSQL RPCs).
- **Payment Gateway**: Razorpay abstraction layer (UPI, Cards, COD fallback).

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Provide your Supabase URL and keys, or enable `EXPO_PUBLIC_ENABLE_MOCK_FALLBACK=true` for instant zero-config testing.

### 3. Run with Expo Go
```bash
npx expo start
```
Scan the QR code with **Expo Go** on Android to experience DishNex live.

### 4. Run Tests & Validation
```bash
npm run ts:check   # Strict TypeScript compile verification
npm test           # Unit, integration & security regression test suite
```

### 5. Visual QA & Verification
Read the complete visual quality assurance report:
- [docs/DISHNEX_VISUAL_QA.md](docs/DISHNEX_VISUAL_QA.md)
