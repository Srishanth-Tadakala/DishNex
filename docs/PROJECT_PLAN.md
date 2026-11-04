# EMBER — Master Engineering Project Plan

## Executive Summary
EMBER ("Food, with feeling.") is an industry-grade, luxury restaurant discovery, digital menu, ordering, and restaurant operations platform built on React Native (Expo SDK 52, TypeScript, Expo Router) and Supabase PostgreSQL.

The visual authority is derived directly from the 14-screen luxury emerald specification, featuring:
- Deep obsidian and forest emerald surfaces (`#06130F`, `#0B1D15`, `#10271D`, `#193629`)
- Vibrant lime / chartreuse interactive accents (`#D8F06B`, `#B7E44F`)
- Warm ivory typography (`#F5F5EE`, `#F4F0E7`)
- Strict single-brand restaurant architecture with multi-branch database extensibility

---

## 1. Project Phases & Milestones

### Phase A: Discovery, Environment & Foundations (Current)
- [x] Initial repository inspection & Git initialization
- [x] Visual reference analysis (all 14 screens cataloged)
- [x] Expo SDK 52 + Expo Router configuration
- [ ] Dependencies installation & Expo Doctor validation
- [x] Master Project Plan & Architectural Decisions

### Phase B: Design System & Core Primitives
- [ ] Tokens: Colors, typography, spacing, shadows, radius, gradients
- [ ] Typography: Playfair Display / Serif styling + Manrope / Inter sans-serif
- [ ] UI Primitives: Buttons, Badges (Veg/Non-veg), Chips, Inputs, Cards, Bottom Sheets
- [ ] Motion & Feedback: Reanimated transitions, Haptics integration

### Phase C: Backend & Database Engineering
- [ ] Supabase schema: 18+ normalized tables
- [ ] Strict Row Level Security (RLS) policies for customer isolation & staff roles
- [ ] Server-side pricing RPC (prices in integer paise, INR)
- [ ] Complete realistic seed data mirroring visual reference (Hyderabadi Biryani, Paneer, Combos, etc.)
- [ ] Payment gateway abstraction (Razorpay order creation & signature verification)

### Phase D: Customer Journey Implementation (14 Screens)
- [ ] Screen 01: Splash Screen with animated flame & progress indicator
- [ ] Screen 02: Onboarding (Dining)
- [ ] Screen 03: Onboarding (Discovery)
- [ ] Screen 04: Onboarding (Ordering)
- [ ] Screen 05: Authentication (Sign In / Sign Up, tabs, social options, forgot password)
- [ ] Screen 06: Home / Discover (Greeting, search, order selector, Today's Special, categories, bottom nav)
- [ ] Screen 07: Menu / Categories (Grid, filters: All/Veg/Non-Veg/Beverages)
- [ ] Screen 08: Category Menu List (Biryani menu, ratings, price, favorites, add-to-cart)
- [ ] Screen 09: Food Details (Hero image, badges, customizations, add-ons, quantity stepper)
- [ ] Screen 10: Search (Live debounced search, history, trending, filters)
- [ ] Screen 11: Saved / Favourites (Dishes/Restaurants tabs, persistent storage)
- [ ] Screen 12: Cart (Quantity controls, coupon entry, fee & tax breakdown, checkout CTA)
- [ ] Screen 13: Checkout (Address picker, Dine-in/Takeaway/Delivery selector, scheduling, payment method)
- [ ] Screen 14: Order Confirmation (Cloche badge, order ID, delivery estimate, tracking action)

### Phase E: Essential Supporting Screens
- [ ] Customer Profile & Account Management
- [ ] Address Book (Add, edit, delete, set default)
- [ ] Order History & Detailed Live Tracking
- [ ] Notifications Center
- [ ] Help, Support & Privacy Controls

### Phase F: Operational Staff Mode
- [ ] Staff Authentication & Role Verification (`owner`, `manager`, `chef`, `staff`)
- [ ] Live Staff Dashboard (metrics, active/completed counts)
- [ ] Realtime Order Queue & Status Updates (Accept, Reject, Preparing, Ready, Dispatched, Completed)
- [ ] Menu Administration (Item toggle, pricing, stock availability)

### Phase G: Quality Assurance, Security & Verification
- [ ] Unit & calculation tests (Cart, tax, coupons, validation schemas)
- [ ] Visual QA comparison table across all 14 screens
- [ ] Security threat model & mitigation verification
- [ ] Expo diagnostics & TypeScript strict mode check (`tsc --noEmit`)

