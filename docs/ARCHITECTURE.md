# EMBER — Technical Architecture Document

## 1. Architectural Philosophy
EMBER is engineered as a single-brand, high-end hospitality platform designed with luxury aesthetic rigor and mission-critical reliability. The architecture enforces separation of concerns across presentation, domain state, backend persistence, and transactional execution.

```
+---------------------------------------------------------------------------------------+
|                                    EMBER CLIENT                                       |
|                               (React Native + Expo SDK 52)                            |
+---------------------------------------------------------------------------------------+
|  Expo Router v4 (File-based navigation: (customer), (auth), (staff))                  |
|  Presentation: Emerald Luxury Design System (Tokens, Glassmorphic Panels, Lime Accents)|
+---------------------------------------------------------------------------------------+
|  Client State: Zustand (Local Cart, Order Mode, Ephemeral Filters)                    |
|  Server State: TanStack Query (Menu, Orders, Customer Profile, Realtime sync)         |
|  Persistent Local Cache: AsyncStorage & SecureStore                                   |
+---------------------------------------------------------------------------------------+
                                           |
                                  REST / Realtime / RPC
                                           v
+---------------------------------------------------------------------------------------+
|                                  SUPABASE BACKEND                                     |
|                              (PostgreSQL 15 + RLS Engine)                             |
+---------------------------------------------------------------------------------------+
|  Auth: GoTrue (Email/Password, JWT Session persistence)                               |
|  RPC: Transactional Order Creation (create_customer_order with authoritative pricing)  |
|  Realtime Engine: WebSocket publication of kitchen order updates to staff and customer|
|  Row-Level Security: Customer isolation + Role-based Staff access                    |
+---------------------------------------------------------------------------------------+
                                           |
                             Authoritative Payment Boundary
                                           v
+---------------------------------------------------------------------------------------+
|                              PAYMENT GATEWAY (RAZORPAY)                               |
|                     Server-side order generation & signature verify                   |
+---------------------------------------------------------------------------------------+
```

## 2. Directory Structure
```
src/
├── app/                      # Expo Router navigation routes
│   ├── _layout.tsx           # Global Root layout with Providers & Theme
│   ├── index.tsx             # Entry route & initial redirection
│   ├── (auth)/               # Customer & staff authentication flows
│   │   ├── sign-in.tsx       # Screen 05: Sign In / Sign Up
│   │   └── forgot-password.tsx
│   ├── (customer)/           # Customer application
│   │   ├── (tabs)/           # Persistent 4-item bottom navigation
│   │   │   ├── _layout.tsx   # Custom emerald bottom navigation bar
│   │   │   ├── index.tsx     # Screen 06: Home / Discover
│   │   │   ├── menu.tsx      # Screen 07: Menu / Categories
│   │   │   ├── saved.tsx     # Screen 11: Saved / Favourites
│   │   │   └── cart.tsx      # Screen 12: Cart
│   │   ├── onboarding/       # Screens 02, 03, 04
│   │   ├── category/[id].tsx # Screen 08: Category Menu List (Biryani)
│   │   ├── food/[id].tsx     # Screen 09: Food Details & Customization
│   │   ├── search.tsx        # Screen 10: Live Search
│   │   ├── checkout.tsx      # Screen 13: Checkout
│   │   ├── confirmation.tsx  # Screen 14: Order Confirmation
│   │   ├── orders/           # Order history & live order tracking
│   │   ├── addresses/        # Address book management
│   │   ├── profile.tsx       # User profile & settings
│   │   └── support.tsx       # Customer assistance & FAQ
│   └── (staff)/              # Role-protected Restaurant Operations
│       ├── _layout.tsx       # Staff authentication guard
│       ├── index.tsx         # Staff Dashboard (metrics & quick actions)
│       ├── orders.tsx        # Realtime Kitchen Display & Order Queue
│       └── menu-admin.tsx    # Menu Item & Stock Availability Admin
├── components/               # Atomic & composite UI components
│   ├── common/               # Buttons, Badges, Chips, Inputs, Loading Skeletons
│   ├── cards/                # FoodCard, CategoryCard, SpecialPlateCard
│   ├── navigation/           # CustomBottomBar, EmeraldHeader
│   └── order/                # Stepper, StatusTimeline, AddressCard
├── services/                 # Supabase client, payment gateway, mock fallback
├── store/                    # Zustand stores (cartStore, authStore, settingsStore)
├── theme/                    # Color tokens, typography, spacing, shadows
├── types/                    # Domain models, database types, navigation types
└── utils/                    # Currency formatting (paise to INR), date formatting
```

## 3. Monetary Strategy
To eliminate rounding discrepancies across discounts, packaging, delivery, and tax computations:
- Every amount is strictly stored and calculated as an integer in **paise** (1 INR = 100 paise).
- Example: `₹299` is represented internally as `29900`.
- Display formatting utility converts `29900` -> `₹299` using `Intl.NumberFormat('en-IN')`.

