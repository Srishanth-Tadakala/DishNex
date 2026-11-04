# EMBER — Database Architecture & Entity Specifications

## 1. Relational Entity Overview
The database schema is modeled to support a luxury flagship dining brand with seamless forward compatibility for multi-branch regional expansion.

### Core Tables & Relationships
1. **`restaurants`**: Root tenant containing brand identity, currency, and operational status.
2. **`restaurant_branches`**: Physical locations (e.g., Flagship Rajkot Branch) with specific tax rates, packaging charges, and delivery base fees.
3. **`restaurant_staff`**: Role-based access mapping (`owner`, `manager`, `chef`, `staff`) tied to Supabase Auth profiles.
4. **`menu_categories`**: Hierarchical categories (Biryani, Starters, Main Course, Desserts, Beverages, Combos).
5. **`menu_items`**: Individual culinary offerings with dietary flags (`veg`, `non-veg`, `vegan`), spice classification, calorie metrics, ratings, and real-time stock availability.
6. **`menu_item_addons`**: Up-sell options linked to specific items (e.g., Extra Chicken +₹79).
7. **`addresses`**: Customer geocoded delivery coordinates with default flag.
8. **`favourites`**: Per-user saved dishes isolating user preferences.
9. **`coupons`**: Discount promotions with start/expiry timestamps and minimum order criteria.
10. **`orders`**: Authoritative order header containing subtotal, discount, tax, packaging, delivery fee, order mode (`dine_in`, `takeaway`, `delivery`), status, and idempotency key.
11. **`order_items`**: Immutable line-item snapshot capturing item names and unit prices at time of order creation.
12. **`payment_attempts`**: Audit trail of Razorpay order/payment IDs, signatures, and verification statuses.
13. **`order_status_history`**: Chronological log of status transitions for auditability and SLA tracking.

---

## 2. Row Level Security (RLS) Matrix

| Entity | Customer | Staff (Assigned Branch) | Staff (Other Branch) | Public (Unauthenticated) |
|---|---|---|---|---|
| `profiles` | Own record only (R/W) | Own record only | Own record only | None |
| `restaurants` | Read only | Read only | Read only | Read only |
| `restaurant_branches` | Read only | Read only | Read only | Read only |
| `menu_categories` | Read only | Read only | Read only | Read only |
| `menu_items` | Read only (available) | Full (Owner/Manager) | None | Read only (available) |
| `addresses` | Own records only (CRUD) | None | None | None |
| `favourites` | Own records only (CRUD) | None | None | None |
| `orders` | Own orders only (Read) | Branch orders (Read/Update) | None | None |
| `order_items` | Own order items only | Branch order items | None | None |

---

## 3. Data Integrity & Concurrency Controls
- **Idempotency**: Orders require a unique client-generated UUID `idempotency_key` to prevent double-charging on network dropouts.
- **Price Freezing**: Prices are never read from the cart at order insertion; they are calculated via server-side PL/pgSQL function `create_customer_order`.

