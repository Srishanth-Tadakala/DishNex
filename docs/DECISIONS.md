# EMBER — Architecture Decision Records (ADR)

## ADR 001: Mobile Framework Selection
- **Status**: Accepted
- **Decision**: React Native with Expo SDK 52, TypeScript Strict Mode, and Expo Router v4.
- **Rationale**: Provides exceptional DX, first-class Android support, file-based routing matching modern production standards, and direct compatibility with Expo Go for rapid live testing and previewing without mandatory native compilation hurdles.

## ADR 002: Emerald Luxury Design System & Color Tokens
- **Status**: Accepted
- **Decision**: Adopt the deep obsidian-emerald palette (`#06130F` background, `#10271D` surface) with vibrant lime accents (`#D8F06B`) and warm ivory typography (`#F5F5EE`).
- **Rationale**: Directly aligns with the 14-screen visual authority reference provided in the product specification. Conveys fine-dining opulence while maintaining high WCAG AA contrast for text and interactive targets.

## ADR 003: Backend & Persistence Architecture
- **Status**: Accepted
- **Decision**: Supabase (PostgreSQL 15+, GoTrue Auth, Realtime, Row-Level Security, Edge Functions).
- **Rationale**: Enterprise-grade relational integrity for multi-item orders, custom add-ons, branch support, and strict customer isolation via RLS policies. Realtime subscriptions enable live kitchen display system (KDS) order tracking for restaurant staff.

## ADR 004: Monetary Calculations in Integer Paise
- **Status**: Accepted
- **Decision**: Store and compute all currency values in integer paise (1 INR = 100 paise).
- **Rationale**: Prevents floating-point rounding errors across line-item taxes, restaurant packaging fees, percentage-based discounts, and payment gateway authorizations.

## ADR 005: State Management Separation of Concerns
- **Status**: Accepted
- **Decision**: 
  - **Zustand**: Fast client-side ephemeral state (Cart, active order mode, UI filters, local preferences).
  - **TanStack Query**: Asynchronous server state caching, pagination, deduplication, and background refetching (menu, order history, profile).
  - **AsyncStorage**: Persistent local cache (cart persistence, onboarding completion flag).
  - **SecureStore**: Protected auth tokens.
- **Rationale**: Eliminates synchronization drift between client and server data.

## ADR 006: Payment Integration Boundary
- **Status**: Accepted
- **Decision**: Razorpay API abstraction with server-side order generation and signature verification.
- **Rationale**: Razorpay is the primary Indian payments processor supporting UPI, Cards, NetBanking, and Wallets. For Expo Go compatibility where native Android SDK bridges require custom builds, provide a standardized hosted/web checkout fallback alongside Cash on Delivery (COD) mode.

