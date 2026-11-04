-- ==============================================================================
-- EMBER — SEED DATA (Visual Reference Aligned)
-- Matches exact prices, names, and images from the 14-screen reference
-- ==============================================================================

-- 1. Insert Core Restaurant
INSERT INTO public.restaurants (
    id,
    name,
    tagline,
    description,
    logo_url,
    currency,
    is_active
) VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'EMBER',
    'Food, with feeling.',
    'A luxury fine-dining sanctuary offering modern Indian gastronomy, dum-cooked biryanis, and artisanal desserts.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80',
    'INR',
    true
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Branch (Rajkot Branch matching Screen 13 delivery address)
INSERT INTO public.restaurant_branches (
    id,
    restaurant_id,
    name,
    address_line,
    city,
    state,
    postal_code,
    phone_number,
    is_accepting_orders,
    tax_rate_percent,
    packaging_fee_paise,
    delivery_fee_base_paise
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'EMBER Flagship — Rajkot',
    'Marwadi University Road, Gauridad',
    'Rajkot',
    'Gujarat',
    '360003',
    '+91 98765 43210',
    true,
    5.00,
    4000, -- 40 INR
    0     -- Free or 50 INR depending on promo
) ON CONFLICT (id) DO NOTHING;

-- 3. Categories matching Screen 7 & Screen 6
INSERT INTO public.menu_categories (id, restaurant_id, name, slug, description, image_url, display_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Biryani', 'biryani', 'Aromatic dum-cooked basmati rice with tender spices', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80', 1),
('c0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'Starters', 'starters', 'Crispy, smoky appetisers from the charcoal tandoor', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&q=80', 2),
('c0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'Main Course', 'main-course', 'Rich, velvety gravies simmered with heirloom spices', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80', 3),
('c0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 'Desserts', 'desserts', 'Decadent artisanal sweets and molten confections', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80', 4),
('c0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000001', 'Beverages', 'beverages', 'Botanical mocktails, craft shakes and coolers', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', 5),
('c0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000001', 'Combos', 'combos', 'Curated multi-course platters for dining bliss', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80', 6)
ON CONFLICT (id) DO NOTHING;

-- 4. Menu Items (Exact matches from Screens 6, 8, 9, 10, 11, 12)
INSERT INTO public.menu_items (
    id, restaurant_id, category_id, name, description, price_paise, image_url,
    dietary_classification, spice_level, serving_info, calories, prep_time_minutes,
    rating, reviews_count, is_available, is_featured, display_order
) VALUES
-- Hyderabadi Chicken Biryani (Screen 8, 9, 10, 11, 12)
(
    'm0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Hyderabadi Chicken Biryani',
    'A royal blend of aromatic basmati rice, tender chicken, and authentic Hyderabadi spices, slow-cooked to perfection.',
    29900, -- ₹299
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    'non-veg', 'medium', 'Serves 1-2', 690, 25, 4.8, 1200, true, true, 1
),
-- Mutton Biryani (Screen 8, 10)
(
    'm0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Mutton Biryani',
    'Slow-braised succulent goat meat layered with saffron-infused long grain rice and caramelized onions.',
    39900, -- ₹399
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80',
    'non-veg', 'spicy', 'Serves 1-2', 780, 30, 4.7, 896, true, false, 2
),
-- Paneer Biryani (Screen 8, 10)
(
    'm0000000-0000-0000-0000-000000000003',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Paneer Biryani',
    'Charcoal-grilled cottage cheese cubes simmered in spiced basmati rice with mint and brown onions.',
    27900, -- ₹279
    'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&q=80',
    'veg', 'medium', 'Serves 1-2', 620, 20, 4.6, 412, true, false, 3
),
-- Special Family Biryani (Serves 3) (Screen 8, 10)
(
    'm0000000-0000-0000-0000-000000000004',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Special Family Biryani (Serves 3)',
    'Grand feast platter containing double portions of royal spiced chicken, boiled eggs, and salan gravy.',
    84900, -- ₹849
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80',
    'non-veg', 'medium', 'Serves 3-4', 1850, 35, 4.9, 2100, true, true, 4
),
-- Paneer Butter Masala (Screen 11, 12)
(
    'm0000000-0000-0000-0000-000000000005',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'Paneer Butter Masala',
    'Cottage cheese cubes bathed in a velvety makhani sauce infused with fresh butter, cream, and kasuri methi.',
    29900, -- ₹299
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    'veg', 'mild', 'Serves 1-2', 540, 20, 4.7, 730, true, true, 5
),
-- Chocolate Lava Cake (Screen 11, 12)
(
    'm0000000-0000-0000-0000-000000000006',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000004',
    'Chocolate Lava Cake',
    'Warm Belgian dark chocolate cake with a molten truffle centre, served with vanilla bean cream.',
    19900, -- ₹199
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
    'veg', 'mild', 'Serves 1', 420, 15, 4.9, 580, true, true, 6
),
-- Mango Shake (Screen 11)
(
    'm0000000-0000-0000-0000-000000000007',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005',
    'Mango Shake',
    'Pure Alphonso mango pulp blended with whole milk and topped with chopped pistachios.',
    14900, -- ₹149
    'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80',
    'veg', 'mild', 'Serves 1', 280, 10, 4.6, 320, true, false, 7
),
-- Chef''s Signature Plate (Today''s Special - Screen 6)
(
    'm0000000-0000-0000-0000-000000000008',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000006',
    'Chef''s Signature Plate',
    'A curated meal crafted with seasonal ingredients, smoked tandoori cutlets, saffron pulao, and signature accompaniments.',
    49900, -- ₹499
    'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&q=80',
    'non-veg', 'medium', 'Serves 1-2', 710, 25, 4.9, 950, true, true, 8
)
ON CONFLICT (id) DO NOTHING;

-- 5. Addons for Hyderabadi Chicken Biryani (Screen 9)
INSERT INTO public.menu_item_addons (id, menu_item_id, name, price_paise, is_available) VALUES
('a0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'Extra Chicken', 7900, true),
('a0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000001', 'Extra Raita & Salan', 3900, true),
('a0000000-0000-0000-0000-000000000003', 'm0000000-0000-0000-0000-000000000001', 'Boiled Egg (2 pcs)', 4000, true)
ON CONFLICT (id) DO NOTHING;

-- 6. Coupons
INSERT INTO public.coupons (id, code, description, discount_type, discount_value, min_order_amount_paise, max_discount_paise, starts_at, expires_at, is_active) VALUES
('d0000000-0000-0000-0000-000000000001', 'WELCOME50', '50% off on your first order up to ₹150', 'percentage', 50, 29900, 15000, timezone('utc', now()), timezone('utc', now() + interval '1 year'), true),
('d0000000-0000-0000-0000-000000000002', 'EMBERFEST', 'Flat ₹100 off on gourmet orders over ₹500', 'flat', 10000, 50000, 10000, timezone('utc', now()), timezone('utc', now() + interval '1 year'), true)
ON CONFLICT (id) DO NOTHING;

