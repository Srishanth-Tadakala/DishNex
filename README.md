# DishNex — Discover. Dine. Delight.

<div align="center">

![DishNex Logo Flame](https://img.shields.io/badge/DishNex-Luxury%20Gastronomy-D8F06B?style=for-the-badge&logoColor=06130F)
[![React Native](https://img.shields.io/badge/React%20Native-0.76.7-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo%20SDK-52.0.37-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3%20Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2015-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Jest Tests](https://img.shields.io/badge/Tests-36%2F36%20Passing-brightgreen?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

**An industry-grade, luxury restaurant discovery, digital menu, table reservation, and food ordering ecosystem.**  
*Combines the refined visual elegance of a high-end luxury hospitality brand with the mission-critical reliability of a high-concurrency commerce engine.*

[Explore 14 Screens](#-the-14-authoritative-customer-screens) • [Design System](#-luxury-design-system--motion-engineering) • [Architecture](#-technical-architecture) • [Staff Operations](#-operational-restaurant-staff-ecosystem) • [Quick Start](#-quick-start-guide) • [Security & RLS](#-security-controls--threat-mitigation)

---

</div>

## 📖 Table of Contents
- [Executive Overview](#-executive-overview)
- [The 14 Authoritative Customer Screens](#-the-14-authoritative-customer-screens)
- [Luxury Design System & Motion Engineering](#-luxury-design-system--motion-engineering)
- [Operational Restaurant Staff Ecosystem](#-operational-restaurant-staff-ecosystem)
- [Technical Architecture](#-technical-architecture)
- [Financial Integrity & Integer-Paise Engine](#-financial-integrity--integer-paise-engine)
- [Security Controls & Threat Mitigation](#-security-controls--threat-mitigation)
- [Repository Structure](#-repository-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Verification & Quality Gates](#-verification--quality-gates)
- [Engineering Documentation Index](#-engineering-documentation-index)

---

## 💎 Executive Overview

**DishNex** is engineered from the ground up as a production-grade restaurant platform. Rather than a superficial UI concept or isolated screens, it represents a complete, cohesive, end-to-end hospitality software platform serving two primary personas:

1. **The Gourmet Diner**: A visually breathtaking, friction-free ordering application for **Dine-In**, **Takeaway**, and **Home Delivery**, featuring real-time dish customization, intelligent cart recalculation, and animated order tracking.
2. **The Restaurant Operations Team**: A role-protected, high-efficiency management suite featuring a live **Kitchen Display System (KDS)**, order queue transitions, real-time revenue analytics, and on-the-fly **86/Out-of-Stock** menu control.

The visual identity is grounded in an authentic **Obsidian Emerald (`#06130F`)**, **Luminous Haute Chartreuse (`#D8F06B`)**, and **Tactile Warm Ivory (`#F4F0E7`)** aesthetic, built to match the 14-screen visual reference authority with 100% precision.

---

## 📱 The 14 Authoritative Customer Screens

Every single screen has been engineered, styled, and verified against the strict visual reference specifications:

| # | Screen Name | Route Path | Visual & Functional Highlights |
|:---:|---|---|---|
| **01** | **Splash Screen** | `src/app/index.tsx` | Ambient emerald glow aura, glowing flame insignia, editorial serif **DishNex** wordmark, hero gourmet dish entrance, and lime illuminated loading bar. |
| **02** | **Onboarding (Dining)** | `src/app/(customer)/onboarding?step=0` | Ambient fine-dining photography, *"A Premium Dining Experience in Your Pocket"*, 3-dot pagination (Dot 1 active), tactile *Skip* & neon lime *Next ➔* pill. |
| **03** | **Onboarding (Discovery)** | `src/app/(customer)/onboarding?step=1` | Deconstructed gourmet burger hero photography, *"Discover Irresistible Menus"*, Dot 2 active, fluid spring transition. |
| **04** | **Onboarding (Ordering)** | `src/app/(customer)/onboarding?step=2` | Executive chef plating hero, *"Order Seamlessly"*, Dot 3 active, primary *Get Started* action button routing to main experience. |
| **05** | **Sign In / Sign Up** | `src/app/(auth)/sign-in.tsx` | Top flame branding, *"Welcome Back 👋"*, custom segmented pill selector, focused input ambient glow, password visibility toggle, *Sign In ➔*, and social authentication row (Google, Apple, Phone). |
| **06** | **Home / Discover** | `src/app/(customer)/(tabs)/index.tsx` | Circular avatar with lime ring, personalized greeting (`Good Evening, Siddu 👋`), notification bell with active dot, rounded pill search bar, Dine In / Takeaway / Delivery segment, *Chef's Signature Plate* hero card with round preview & arrow action, and horizontal category bubbles. |
| **07** | **Menu / Categories** | `src/app/(customer)/(tabs)/menu.tsx` | Header with search shortcut, *All / Veg / Non-Veg / Beverages* filter chips, 2-column grid of rich category cards with exact counts (Biryani: 12, Starters: 18, Main Course: 24, Desserts: 10, Beverages: 14, Combos: 8). |
| **08** | **Menu List (Biryani)** | `src/app/(customer)/category/[id].tsx` | Left back navigation, dietary filters, dark obsidian food cards with crisp white typography, ratings (`4.8 (1.2k)`), prices (`₹299`), heart outline, and glowing chartreuse `+` quick-add buttons. |
| **09** | **Food Details** | `src/app/(customer)/food/[id].tsx` | Full-screen hero food photography in traditional brass bowl, floating back & heart buttons, tactile **Warm Ivory (`#F4F0E7`)** bottom sheet card, dish description, 3 metric badges (*Spicy Level*, *Serves 1-2*, *~650 Calories*), *Extra Chicken (+₹79)* add-on checkbox, physical stepper, and sticky *Add to Cart ₹299* pill. |
| **10** | **Live Search** | `src/app/(customer)/search.tsx` | Search bar with instant query execution, clear `x` icon, *All / Dishes / Categories* pills, *Results (12)* count header, and live item cards. |
| **11** | **Saved / Favourites** | `src/app/(customer)/(tabs)/saved.tsx` | *Dishes (4) \| Restaurants* segmented selector, dark luxury item cards (*Hyderabadi Chicken Biryani*, *Chocolate Lava Cake*, *Paneer Butter Masala*, *Mango Shake*), and active red heart indicators. |
| **12** | **Shopping Cart** | `src/app/(customer)/(tabs)/cart.tsx` | Clear-all trash action, itemized card list with quantity steppers, coupon redemption input (*WELCOME50*, *DISHNEX*), and live bill recalculation: Subtotal `₹797` + Taxes (5%) `₹40` = Total `₹837`. |
| **13** | **Checkout Pipeline** | `src/app/(customer)/checkout.tsx` | 3-step progress stepper (*Address ✔ ➔ Payment ➔ Confirm*), **Warm Ivory** delivery address card (*Home: Marwadi University, Rajkot, Gujarat - 360003*), Dine In / Takeaway / Delivery selector, delivery time estimate (~30-40 mins), UPI payment method card, and *Pay ₹837 ➔* action. |
| **14** | **Order Confirmation** | `src/app/(customer)/confirmation.tsx` | Glowing metallic room service cloche with animated checkmark badge, 360-degree celebratory radial particle burst, *"Order Placed Successfully! 🎉"*, Order ID `#EMB83721`, Estimated Delivery `30 - 40 mins`, *Track Order*, and *Back to Home* actions. |

---

## 🎨 Luxury Design System & Motion Engineering

### 1. Color Palette Tokens (`src/theme/colors.ts`)

| Token | Hex Value | Semantic Purpose |
|---|---|---|
| `colors.background` | `#06130F` | Deep Obsidian Emerald — Primary application canvas |
| `colors.backgroundSecondary` | `#0B1D15` | Forest Night — Tab bar, headers, and section containers |
| `colors.surface` | `#10271D` | Deep Pine — Interactive cards and surface containers |
| `colors.surfaceSecondary` | `#193629` | Pill backgrounds, segmented tracks, and inputs |
| `colors.warmIvory` / `surfaceIvory` | `#F4F0E7` | Tactile Paper — Food details sheet, Checkout address card |
| `colors.accent` | `#D8F06B` | Signature Haute Chartreuse / Neon Lime — Primary CTAs, active pills |
| `colors.accentSecondary` | `#B7E44F` | Gradient active stop for tactile push depth |
| `colors.gold` | `#F5C042` | Luminous Flame Gold — Stars, ratings, and flame ambient glow |
| `colors.textPrimary` | `#F5F5EE` | Soft White — High-readability titles and headlines |
| `colors.textSecondary` | `#A8B6AA` | Soft Sage — Descriptions, metadata, and subtitles |
| `colors.textDark` | `#06130F` | Deep Obsidian — Maximum contrast text inside lime CTA buttons |

### 2. Cross-Platform Shadows (`src/theme/spacing.ts`)
To eliminate React Native Web deprecation warnings (`"shadow*" style props are deprecated. Use "boxShadow"`), the design system employs an isomorphic shadow factory:
- **Web**: Emits standard W3C CSS `boxShadow` strings (e.g. `0px 4px 10px rgba(0, 0, 0, 0.40)` and `0px 4px 12px rgba(216, 240, 107, 0.35)`).
- **Mobile (Android / iOS)**: Retains hardware-accelerated `elevation`, `shadowColor`, `shadowOffset`, `shadowOpacity`, and `shadowRadius`.

### 3. Sensory Motion & Physics (`src/theme/animations.ts`)
- **Gliding Segmented Indicator**: Spring physics with specular highlight hairline tracking active tabs smoothly.
- **Heart Pop Dynamics**: Two-stage elastic scale animation (`1.0 ➔ 1.45 ➔ 1.0`) paired with medium haptic feedback.
- **Radial Particle Explosion**: 8 celebratory particles dispatched in 360-degree polar coordinates on order completion.
- **Pulsating Cloche Aura**: Continuous sinusoidal expansion loop creating ambient glow depth.
- **Tactile Button Sheen**: Micro-compression (`scale: 0.96`) with high-friction rebound on touch release.

---

## 👨‍🍳 Operational Restaurant Staff Ecosystem

DishNex bridges customer ordering directly into real-time restaurant operations:

```
+----------------------------------------------------------------------------------+
|                           KITCHEN OPERATIONS LIFECYCLE                           |
+----------------------------------------------------------------------------------+
|  Customer Places Order  ──►  Kitchen Display (KDS)  ──►  Chef Prepares Food     |
|       (Status: PLACED)             (Status: CONFIRMED)           (Status: PREPARING)    |
|                                                                    │             |
|  Customer Receives Order  ◄──  Order Out for Delivery  ◄──  Packaged & Ready     |
|      (Status: DELIVERED)          (Status: DISPATCHED)          (Status: READY)        |
+----------------------------------------------------------------------------------+
```

### Role-Protected Staff Portal (`src/app/(staff)/`)
- **RBAC Security Guard**: Only authenticated accounts with roles `owner`, `manager`, `chef`, or `staff` are permitted access.
- **Live Kitchen Display System (KDS)**: Real-time ticket management with visual timer alerts for overdue preparations.
- **Stock & Menu Control (86 Management)**: Instant toggling of dish availability to prevent orders for depleted kitchen inventory.
- **Operational Analytics**: Live count of active tables, open takeaway tickets, delivery dispatches, and daily revenue in paise.

---

## 🏗️ Technical Architecture

DishNex adheres to strict domain separation between presentation, state synchronization, business logic, and database persistence:

```
+---------------------------------------------------------------------------------------+
|                                    DISHNEX CLIENT                                     |
|                              (React Native + Expo SDK 52)                             |
+---------------------------------------------------------------------------------------+
|  Navigation: Expo Router v4 (Typed Routes, Layout Boundaries, Deep-linking)           |
|  Presentation: Obsidian Emerald Design System + Cross-Platform Shadow Engine           |
|  Client State: Zustand (CartStore, AuthStore, FavoritesStore, SettingsStore)         |
|  Server State: TanStack Query (Background revalidation, query deduplication)          |
|  Persistence: AsyncStorage (Cart/Favorites) & Expo SecureStore (Auth Tokens)          |
+---------------------------------------------------------------------------------------+
                                           │
                                  REST / Realtime / RPC
                                           ▼
+---------------------------------------------------------------------------------------+
|                                  SUPABASE BACKEND                                     |
|                            (PostgreSQL 15 + RLS Engine)                               |
+---------------------------------------------------------------------------------------+
|  GoTrue Auth: JWT session management, RBAC profile synchronization                    |
|  RPC Engine: create_customer_order (Atomic transactional order validation)            |
|  Realtime WebSockets: Instant kitchen ticket broadcast to staff and customer           |
|  Row Level Security (RLS): Multi-tenant customer isolation & staff role boundaries    |
+---------------------------------------------------------------------------------------+
                                           │
                                 Authoritative Boundary
                                           ▼
+---------------------------------------------------------------------------------------+
|                              PAYMENT GATEWAY (RAZORPAY)                               |
|                     Server-side order generation & signature verify                   |
+---------------------------------------------------------------------------------------+
```

---

## 💰 Financial Integrity & Integer-Paise Engine

To completely eliminate floating-point rounding errors and precision loss:
- **100% Integer Arithmetic**: All monetary values throughout database schemas, Zustand stores, RPCs, and APIs are calculated and stored in **integer paise** (`1 INR = 100 paise`).
  - Example: `₹299.00` is represented internally as `29900`.
- **Authoritative Server-Side Pricing**: The client submits only `menu_item_id`, `selected_addons`, and `quantity`. The backend database RPC recalculates:
  $$\text{Subtotal} = \sum (\text{item.pricePaise} + \sum \text{addon.pricePaise}) \times \text{quantity}$$
  $$\text{Tax (GST 5\%)} = \text{round}(\text{Subtotal} \times 0.05)$$
  $$\text{Total} = \text{Subtotal} - \text{Discount} + \text{Tax} + \text{Packaging} + \text{Delivery}$$
  *Any client attempt to manipulate prices is mathematically ignored by the database procedure.*

---

## 🛡️ Security Controls & Threat Mitigation

DishNex implements defense-in-depth security validated through rigorous threat modeling:

1. **PostgreSQL Row Level Security (RLS)**:
   - Customers can only read and mutate their own orders, addresses, and profiles.
   - Staff operations require verified JWT claims matching `role IN ('staff', 'chef', 'manager', 'owner')`.
2. **Idempotent Order Creation**:
   - Every order submission requires a unique client-generated `idempotency_key`. Duplicate requests (e.g. from rapid button taps or network retries) return the existing transaction without double-charging.
3. **Anti-Tampering Payment Verifier**:
   - Razorpay payment signatures are validated using HMAC SHA-256 before marking orders as `captured`.
4. **Isomorphic SSR Layout Effect**:
   - Includes custom polyfill ([src/utils/ssr-polyfill.ts](src/utils/ssr-polyfill.ts)) preventing React 18 server-side mismatch errors during static web exports.

---

## 📁 Repository Structure

```
c:\Users\siddu\OneDrive\Desktop\EMBER\
├── assets/                       # Brand icons, splash art, and imagery
├── docs/                         # Comprehensive engineering documentation
│   ├── ARCHITECTURE.md           # System design & component contracts
│   ├── AUDIT_REPORT.md           # Independent architectural audit findings
│   ├── DATABASE_DESIGN.md        # PostgreSQL schemas, tables & indexes
│   ├── DECISIONS.md              # Architectural Decision Records (ADRs)
│   ├── DEPLOYMENT.md             # EAS Build & cloud deployment guide
│   ├── DISHNEX_VISUAL_QA.md      # Screen-by-screen visual verification
│   ├── SECURITY/                 # Threat assessment, STRIDE analysis & RLS
│   ├── TESTING/                  # Test matrix & QA validation procedures
│   └── visual_qa/                # Actual vs. Reference screenshot comparisons
├── scripts/                      # Autonomous test & screenshot utilities
│   ├── capture_all_screens.js    # Automated headless Chrome 14-screen capture
│   └── test_order_flow.js        # End-to-end checkout verification script
├── src/
│   ├── app/                      # Expo Router file-based route hierarchy
│   │   ├── _layout.tsx           # Global root layout with theme & query providers
│   │   ├── index.tsx             # Screen 01: Splash Screen & Brand Reveal
│   │   ├── (auth)/sign-in.tsx    # Screen 05: Sign In / Sign Up
│   │   ├── (customer)/           # Customer application domain
│   │   │   ├── (tabs)/           # 4-Item bottom navigation layout
│   │   │   │   ├── _layout.tsx   # Luxury emerald tab bar with animated icons
│   │   │   │   ├── index.tsx     # Screen 06: Home / Discover
│   │   │   │   ├── menu.tsx      # Screen 07: Menu / Categories Grid
│   │   │   │   ├── saved.tsx     # Screen 11: Saved / Favourites
│   │   │   │   └── cart.tsx      # Screen 12: Shopping Cart & Bill Summary
│   │   │   ├── onboarding/       # Screens 02, 03, 04: Onboarding Carousel
│   │   │   ├── category/[id].tsx # Screen 08: Category Menu List (Biryani)
│   │   │   ├── food/[id].tsx     # Screen 09: Food Details & Customization
│   │   │   ├── search.tsx        # Screen 10: Live Search & Filters
│   │   │   ├── checkout.tsx      # Screen 13: Multi-Step Checkout Pipeline
│   │   │   ├── confirmation.tsx  # Screen 14: Order Confirmation & Celebration
│   │   │   ├── orders/           # Order tracking & history
│   │   │   ├── addresses/        # Address book management
│   │   │   ├── profile.tsx       # User profile & preferences
│   │   │   └── support.tsx       # Customer assistance & FAQ
│   │   └── (staff)/              # Restaurant operations domain
│   │       ├── _layout.tsx       # Role-based staff authentication guard
│   │       ├── index.tsx         # Staff dashboard & live metrics
│   │       ├── orders.tsx        # Real-time Kitchen Display System (KDS)
│   │       └── menu-admin.tsx    # Stock availability & 86 toggling
│   ├── components/               # Atomic, molecular & composite UI components
│   │   ├── cards/                # FoodCard, CategoryCard, SpecialPlateCard
│   │   ├── common/               # Button, SegmentedControl, Header, Stepper, Logo
│   │   └── order/                # Stepper, AddressSelector, StatusTimeline
│   ├── services/                 # Supabase client, Razorpay abstraction, Mock dataset
│   ├── store/                    # Zustand stores (cartStore, authStore, favoritesStore)
│   ├── theme/                    # Color tokens, typography, spacing, shadows, animations
│   ├── types/                    # Domain models, database schemas, and route types
│   └── utils/                    # Currency formatting, date helpers, SSR polyfill
└── supabase/                     # PostgreSQL database migrations & RPC scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: npm, yarn, or pnpm
- **Mobile Device / Emulator**:
  - Android: **Expo Go** app from Google Play Store or Android Studio Emulator
  - iOS: **Expo Go** app from Apple App Store or Xcode Simulator
  - Web: Google Chrome, Safari, or Microsoft Edge

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Srishanth-Tadakala/DishNex.git
cd DishNex

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy the example environment template:
```bash
cp .env.example .env
```
For zero-config instant evaluation, the application includes a complete, high-fidelity mock dataset fallback (`EXPO_PUBLIC_ENABLE_MOCK_FALLBACK=true`). To connect your live Supabase cloud instance:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
EXPO_PUBLIC_ENABLE_MOCK_FALLBACK=false
```

### 4. Running the Application
```bash
# Start the Metro bundler
npx expo start

# Run directly on Android device/emulator
npm run android

# Run directly in web browser
npm run web
```
Scan the displayed QR code with the **Expo Go** application on your mobile device to launch DishNex instantly.

---

## 🧪 Verification & Quality Gates

DishNex enforces strict, automated quality checks across all branches:

```bash
# 1. Type Safety Check (Zero compilation errors)
npm run ts:check

# 2. Automated Test Suite (36 passing tests)
npm test

# 3. Clean Web Production Export (Zero deprecation warnings)
npx expo export -p web

# 4. Automated 14-Screen Visual Capture
node scripts/capture_all_screens.js
```

### Test Suite Coverage (`npm test`):
- `src/__tests__/currency.test.ts`: Integer paise formatting, tax computation, discount limits.
- `src/__tests__/cartStore.test.ts`: Item addition, addon deduplication, quantity increments, out-of-stock guards.
- `src/__tests__/security.test.ts`: Client price manipulation immunity, negative quantity rejection, SQL injection defense.
- `src/__tests__/api.test.ts`: Idempotent order dispatch, coupon validation, mock-to-live fallback mechanics.

---

## 📚 Engineering Documentation Index

For in-depth architectural analyses, threat models, and database design documents:
- 🏛️ **[Technical Architecture Document](docs/ARCHITECTURE.md)**: Deep dive into state management, layer decoupling, and rendering lifecycles.
- 🗄️ **[Database Design & Schema](docs/DATABASE_DESIGN.md)**: Full PostgreSQL table schemas, indexes, and stored procedures.
- 🔒 **[Security Assessment & STRIDE Analysis](docs/SECURITY/THREAT_ASSESSMENT.md)**: Independent security audit, threat vectors, and RLS policies.
- 🛡️ **[Threat Model & Attack Surface](docs/SECURITY/THREAT_MODEL.md)**: Boundaries, authentication tokens, and payment flow validations.
- 📊 **[Independent Architectural Audit](docs/AUDIT_REPORT.md)**: Evaluation of race conditions, separation of concerns, and transactional guarantees.
- 🖼️ **[Visual QA & 14-Screen Parity Report](docs/visual_qa/VISUAL_QA_REPORT.md)**: Side-by-side photographic comparison across all 14 screens.
- 🚢 **[Deployment & Production Readiness](docs/DEPLOYMENT.md)**: EAS Build configurations, Android APK generation, and CDN hosting.

---

<div align="center">

**DishNex** — Food, with feeling.  
*Crafted for luxury hospitality.*

</div>
