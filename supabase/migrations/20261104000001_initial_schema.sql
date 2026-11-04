-- ==============================================================================
-- EMBER RESTAURANT PLATFORM — INITIAL PRODUCTION SCHEMA MIGRATION
-- PostgreSQL 15+ compatible for Supabase
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Customers, Staff, Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'manager', 'owner', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. RESTAURANTS
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tagline TEXT DEFAULT 'Food, with feeling.',
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    currency TEXT NOT NULL DEFAULT 'INR',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. RESTAURANT BRANCHES
CREATE TABLE IF NOT EXISTS public.restaurant_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address_line TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone_number TEXT,
    is_accepting_orders BOOLEAN NOT NULL DEFAULT true,
    tax_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    packaging_fee_paise INTEGER NOT NULL DEFAULT 4000, -- 40.00 INR
    delivery_fee_base_paise INTEGER NOT NULL DEFAULT 5000, -- 50.00 INR
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. RESTAURANT STAFF (Authorization mapping)
CREATE TABLE IF NOT EXISTS public.restaurant_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.restaurant_branches(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'chef', 'staff')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(restaurant_id, user_id)
);

-- 5. RESTAURANT HOURS
CREATE TABLE IF NOT EXISTS public.restaurant_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES public.restaurant_branches(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(branch_id, day_of_week)
);

-- 6. MENU CATEGORIES
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(restaurant_id, slug)
);

-- 7. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_paise INTEGER NOT NULL, -- in paise (e.g. 29900 = 299 INR)
    image_url TEXT NOT NULL,
    dietary_classification TEXT NOT NULL CHECK (dietary_classification IN ('veg', 'non-veg', 'vegan', 'egg')),
    spice_level TEXT NOT NULL DEFAULT 'medium' CHECK (spice_level IN ('mild', 'medium', 'spicy', 'extra_spicy')),
    serving_info TEXT DEFAULT 'Serves 1-2',
    calories INTEGER,
    prep_time_minutes INTEGER DEFAULT 25,
    rating NUMERIC(2,1) NOT NULL DEFAULT 4.8,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 8. MENU ITEM OPTION GROUPS (e.g., Portion Size, Spice Level)
CREATE TABLE IF NOT EXISTS public.menu_item_option_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    min_selectable INTEGER NOT NULL DEFAULT 0,
    max_selectable INTEGER NOT NULL DEFAULT 1,
    is_required BOOLEAN NOT NULL DEFAULT false
);

-- 9. MENU ITEM OPTIONS (Choices within a group)
CREATE TABLE IF NOT EXISTS public.menu_item_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.menu_item_option_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_delta_paise INTEGER NOT NULL DEFAULT 0,
    is_default BOOLEAN NOT NULL DEFAULT false
);

-- 10. MENU ITEM ADDONS (e.g., Extra Chicken +79 INR)
CREATE TABLE IF NOT EXISTS public.menu_item_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_paise INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true
);

-- 11. ADDRESSES (Customer Saved Addresses)
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home', -- 'Home', 'Work', 'Other'
    recipient_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    street_address TEXT NOT NULL,
    landmark TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 12. FAVOURITES (Saved dishes)
CREATE TABLE IF NOT EXISTS public.favourites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(user_id, menu_item_id)
);

-- 13. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
    discount_value INTEGER NOT NULL, -- percent or paise
    min_order_amount_paise INTEGER NOT NULL DEFAULT 0,
    max_discount_paise INTEGER,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 14. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE RESTRICT,
    branch_id UUID NOT NULL REFERENCES public.restaurant_branches(id) ON DELETE RESTRICT,
    order_type TEXT NOT NULL CHECK (order_type IN ('dine_in', 'takeaway', 'delivery')),
    status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'preparing', 'ready', 'dispatched', 'completed', 'cancelled', 'rejected')),
    rejection_reason TEXT,
    table_identifier TEXT, -- for dine-in
    delivery_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    delivery_address_snapshot JSONB,
    special_instructions TEXT,
    subtotal_paise INTEGER NOT NULL,
    discount_paise INTEGER NOT NULL DEFAULT 0,
    coupon_id UUID REFERENCES public.coupons(id),
    tax_paise INTEGER NOT NULL DEFAULT 0,
    packaging_fee_paise INTEGER NOT NULL DEFAULT 0,
    delivery_fee_paise INTEGER NOT NULL DEFAULT 0,
    total_paise INTEGER NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded', 'cod')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'card', 'netbanking', 'cod')),
    estimated_delivery_time TEXT DEFAULT '30-40 mins',
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 15. ORDER ITEMS (Immutable snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
    item_name TEXT NOT NULL,
    unit_price_paise INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price_paise INTEGER NOT NULL,
    selected_options JSONB DEFAULT '[]'::jsonb,
    selected_addons JSONB DEFAULT '[]'::jsonb
);

-- 16. PAYMENT ATTEMPTS
CREATE TABLE IF NOT EXISTS public.payment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    gateway TEXT NOT NULL DEFAULT 'razorpay',
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    gateway_signature TEXT,
    amount_paise INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('created', 'attempted', 'success', 'failed', 'verified')),
    raw_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 17. ORDER STATUS HISTORY (Audit Trail)
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 18. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'order' CHECK (type IN ('order', 'promo', 'system')),
    metadata JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 19. RESTAURANT SETTINGS
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    auto_accept_orders BOOLEAN NOT NULL DEFAULT false,
    default_prep_time_minutes INTEGER NOT NULL DEFAULT 25,
    enable_cod BOOLEAN NOT NULL DEFAULT true,
    enable_online_payment BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(restaurant_id)
);

-- ==============================================================================
-- INDEXES FOR HIGH PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_branch ON public.orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_favourites_user ON public.favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & edit their own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Public Read for Catalog Data
CREATE POLICY "Public can view active restaurants" ON public.restaurants FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view branches" ON public.restaurant_branches FOR SELECT USING (true);
CREATE POLICY "Public can view categories" ON public.menu_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view menu items" ON public.menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Public can view option groups" ON public.menu_item_option_groups FOR SELECT USING (true);
CREATE POLICY "Public can view options" ON public.menu_item_options FOR SELECT USING (true);
CREATE POLICY "Public can view addons" ON public.menu_item_addons FOR SELECT USING (is_available = true);
CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);

-- Addresses: Isolated to owner
CREATE POLICY "Users view own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- Favourites: Isolated to owner
CREATE POLICY "Users view own favourites" ON public.favourites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own favourites" ON public.favourites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own favourites" ON public.favourites FOR DELETE USING (auth.uid() = user_id);

-- Orders: Customers see only their own orders
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Staff Access: Staff can view and manage all orders for their restaurant branch
CREATE POLICY "Staff can view restaurant orders" ON public.orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.restaurant_staff 
        WHERE restaurant_staff.user_id = auth.uid() 
          AND restaurant_staff.restaurant_id = orders.restaurant_id
          AND (restaurant_staff.branch_id IS NULL OR restaurant_staff.branch_id = orders.branch_id)
          AND restaurant_staff.is_active = true
    )
);
CREATE POLICY "Staff can update order status" ON public.orders FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.restaurant_staff 
        WHERE restaurant_staff.user_id = auth.uid() 
          AND restaurant_staff.restaurant_id = orders.restaurant_id
          AND (restaurant_staff.branch_id IS NULL OR restaurant_staff.branch_id = orders.branch_id)
          AND restaurant_staff.is_active = true
    )
);

-- Menu Administration by Authorized Staff
CREATE POLICY "Staff can manage menu items" ON public.menu_items FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.restaurant_staff 
        WHERE restaurant_staff.user_id = auth.uid() 
          AND restaurant_staff.restaurant_id = menu_items.restaurant_id
          AND restaurant_staff.role IN ('owner', 'manager')
          AND restaurant_staff.is_active = true
    )
);

-- Notifications: Isolated to owner
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

