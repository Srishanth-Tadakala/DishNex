# EMBER — Deployment & Production Operations Guide

## 1. Prerequisites
- Node.js 18+ or 20+ (LTS)
- npm 9+
- Expo CLI (`npx expo`)
- Supabase CLI (`npx supabase`) or a hosted Supabase Project
- Android Studio / Android Device with Expo Go for mobile testing

## 2. Environment Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Populate the required keys:
   - `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Public Key.
   - `EXPO_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Test / Live Key ID.

## 3. Database Deployment
1. Link your Supabase project:
   ```bash
   npx supabase link --project-ref your-project-ref
   ```
2. Apply the PostgreSQL schema and transactional RPC functions:
   ```bash
   npx supabase db push
   ```
   Or execute `supabase/migrations/20261104000001_initial_schema.sql` and `supabase/migrations/20261104000002_order_rpcs.sql` directly inside the Supabase SQL Editor.
3. Seed the catalog and branch information:
   ```bash
   npx supabase db execute --file supabase/seed.sql
   ```

## 4. Running with Expo Go
To test on an Android smartphone or emulator:
1. Start the Expo development server:
   ```bash
   npx expo start
   ```
2. Scan the generated QR code using the **Expo Go** application on your Android phone, or press `a` in the terminal to launch on a running Android emulator.

## 5. Building Production Binaries (EAS Build)
To generate an Android APK / AAB for Google Play Store:
```bash
npx eas-cli build --platform android --profile production
```

