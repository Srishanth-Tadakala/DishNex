# EMBER — Application Threat Model & Security Controls

## Threat Assessment Matrix

| Threat ID | Threat Description | Potential Impact | Affected Component | Mitigation Strategy | Verification Method |
|---|---|---|---|---|---|
| **THREAT-01** | Client-side Price Tampering | Attacker alters item price or discount in payload to order for ₹0 or reduced cost. | Order Placement API | Authoritative server-side calculation via `create_customer_order` RPC. Prices are fetched directly from database tables, ignoring client totals. | Integration test verifying server recalculation overrides manipulated client values. |
| **THREAT-02** | Cross-Customer Data Access | Attacker attempts to query or modify another user's delivery addresses, favourites, or past orders. | Supabase PostgreSQL | Strict Row Level Security (RLS) policies enforcing `auth.uid() = user_id`. | Automated RLS test attempting cross-user queries with simulated JWTs. |
| **THREAT-03** | Unauthorized Staff Mode Elevation | Customer accesses kitchen order queue or alters menu prices. | Staff Portal / API | `restaurant_staff` mapping table verified in RLS policies and backend endpoints. | Policy verification ensuring customers receive 403 Forbidden on staff routes. |
| **THREAT-04** | Duplicate Order & Double Billing | Unstable mobile connection causes retry loops for order placement. | Order Processing / Payment | Idempotency keys (`idempotency_key` UUID) enforced at database level with unique constraint. | Unit test replaying identical order payload with identical key returns cached success. |
| **THREAT-05** | Service Role Secret Exposure | Mobile bundle decompiled to extract Supabase service-role secret. | Mobile Client Bundle | `SUPABASE_SERVICE_ROLE_KEY` is strictly prohibited from client code; only `EXPO_PUBLIC_SUPABASE_ANON_KEY` is used with RLS. | Static analysis scanning build output for secret patterns. |
| **THREAT-06** | Payment Signature Forgery | Attacker sends artificial payment confirmation callback to mark unpaid order as paid. | Payment Verification | Razorpay HMAC-SHA256 signature verification computed server-side using `RAZORPAY_KEY_SECRET`. | Verification test failing on forged signature hash. |
| **THREAT-07** | Stale Menu Item Ordering | Customer attempts to checkout an item that was marked 86 / out-of-stock. | Order Fulfillment | Realtime validation in `create_customer_order` checking `is_available = true`. | Unit test placing order for disabled item raises immediate exception. |

