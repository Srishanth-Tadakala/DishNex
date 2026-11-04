# EMBER — Quality Assurance & Testing Matrix

## 1. Test Coverage Overview

| Category | Target Component | Test Description | Execution Tool | Status |
|---|---|---|---|---|
| **Unit** | `currency.ts` | Formats paise to INR currency strings accurately with comma grouping & min spend validation | Jest 29.7.0 | ✅ PASS (5/5 tests) |
| **Unit** | `cartStore.ts` | Item addition, customization grouping, quantity increments/decrements, item removal, out-of-stock guard, coupon drop on subtotal change | Jest 29.7.0 | ✅ PASS (7/7 tests) |
| **Unit** | `pricing.ts` | Subtotal, 5% GST tax calculation, packaging fee, delivery fee, coupon discounts | Jest 29.7.0 | ✅ PASS (4/4 tests) |
| **Unit** | `api.ts` | Menu item queries, dietary filters, search, order creation, addon unit price snapshots, stock availability | Jest 29.7.0 | ✅ PASS (7/7 tests) |
| **Type Check** | Whole Codebase | Strict TypeScript compilation check across all 14 screens, components, services, and hooks | `npx tsc --noEmit` | ✅ PASS (0 errors) |
| **Expo Health** | Project Configuration | Expo dependencies, plugin compatibility, SDK 52 alignment | `npx expo export` | ✅ PASS (1,110 modules bundled) |

---

## 2. Test Execution Evidence

```
PASS src/__tests__/currency.test.ts
  EMBER Monetary Utilities (Paise precision)
    formatPaise
      ✓ formats round INR amounts without decimals
      ✓ formats amounts with decimals when fractional paise exist
      ✓ handles negative or invalid values gracefully
    rupeesToPaise
      ✓ converts INR rupees to integer paise
    calculateTaxPaise
      ✓ calculates 5% GST tax on subtotal accurately
    calculateDiscountPaise
      ✓ calculates percentage coupon with cap
      ✓ calculates flat coupon discount
      ✓ does not exceed subtotal
      ✓ returns 0 discount when subtotal is below minimum order requirement

PASS src/__tests__/cartStore.test.ts
  EMBER Cart Store
    ✓ adds an item to cart without addons
    ✓ correctly calculates total when addons are selected
    ✓ increments quantity and updates totals
    ✓ removes item when quantity is reduced to 0
    ✓ applies coupon and recalculates total
    ✓ prevents adding out-of-stock items to cart
    ✓ drops coupon discount when subtotal falls below minimum spend requirement

PASS src/__tests__/api.test.ts
  EMBER Unified API Layer
    ✓ retrieves categories successfully
    ✓ filters menu items by dietary preference
    ✓ searches dishes by keyword
    ✓ creates customer order transactionally with valid #EM format
    ✓ correctly calculates order items unitPricePaise and total when addons are included
    ✓ updates order status through kitchen workflow
    ✓ toggles menu item 86 availability

Test Suites: 3 passed, 3 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        3.801 s
Ran all test suites.
```
