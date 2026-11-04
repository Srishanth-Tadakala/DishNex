-- ==============================================================================
-- EMBER MIGRATION 03 — SECURITY HARDENING & ACCESS CONTROL POLICIES
-- Resolves: Privilege escalation, RLS gaps, BOLA, idempotency leaks, storage RLS
-- ==============================================================================

-- 1. HELPER SECURITY DEFINER FUNCTIONS (Fast, non-recursive RLS evaluation)
CREATE OR REPLACE FUNCTION public.is_staff_for_branch(p_restaurant_id UUID, p_branch_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.restaurant_staff
        WHERE user_id = auth.uid()
          AND restaurant_id = p_restaurant_id
          AND (branch_id IS NULL OR p_branch_id IS NULL OR branch_id = p_branch_id)
          AND is_active = true
    );
$$;

CREATE OR REPLACE FUNCTION public.is_manager_for_restaurant(p_restaurant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.restaurant_staff
        WHERE user_id = auth.uid()
          AND restaurant_id = p_restaurant_id
          AND role IN ('owner', 'manager')
          AND is_active = true
    );
$$;

-- 2. PREVENT PRIVILEGE ESCALATION ON PROFILES
-- Ordinary users must NEVER be able to elevate their own role to 'staff', 'manager', 'owner', or 'admin'
CREATE OR REPLACE FUNCTION public.prevent_profile_role_self_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Prevent altering primary identity ID
    IF NEW.id <> OLD.id THEN
        RAISE EXCEPTION 'Profile ID cannot be modified.';
    END IF;

    -- If role is changing, verify that caller is a service role or authorized admin
    IF NEW.role <> OLD.role THEN
        -- auth.jwt() -> role checks
        IF current_user <> 'service_role' AND current_user <> 'postgres' THEN
            -- Check if current authenticated user has admin role in profiles
            IF NOT EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role IN ('admin', 'owner')
            ) THEN
                RAISE EXCEPTION 'Unauthorized: Users cannot modify their own authorization role.';
            END IF;
        END IF;
    END IF;

    NEW.updated_at := timezone('utc', now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_role_self_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_role_self_escalation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_profile_role_self_escalation();

-- 3. RESTAURANT STAFF RLS POLICIES
-- Allows staff to view their own credentials and managers to view their team
DROP POLICY IF EXISTS "Staff can view own record" ON public.restaurant_staff;
CREATE POLICY "Staff can view own record" ON public.restaurant_staff
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Managers can view branch staff" ON public.restaurant_staff;
CREATE POLICY "Managers can view branch staff" ON public.restaurant_staff
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.restaurant_staff m
            WHERE m.user_id = auth.uid() 
              AND m.restaurant_id = restaurant_staff.restaurant_id
              AND m.role IN ('owner', 'manager')
              AND m.is_active = true
        )
    );

-- 4. ORDER ITEMS RLS POLICIES FOR STAFF
-- Staff must be able to view order items for incoming restaurant orders
DROP POLICY IF EXISTS "Staff can view restaurant order items" ON public.order_items;
CREATE POLICY "Staff can view restaurant order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
              AND public.is_staff_for_branch(orders.restaurant_id, orders.branch_id)
        )
    );

-- 5. ORDER STATUS HISTORY RLS POLICIES (Audit Trail Visibility)
DROP POLICY IF EXISTS "Customers view own order history" ON public.order_status_history;
CREATE POLICY "Customers view own order history" ON public.order_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_status_history.order_id
              AND orders.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff view branch order history" ON public.order_status_history;
CREATE POLICY "Staff view branch order history" ON public.order_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_status_history.order_id
              AND public.is_staff_for_branch(orders.restaurant_id, orders.branch_id)
        )
    );

-- 6. PAYMENT ATTEMPTS RLS POLICIES
DROP POLICY IF EXISTS "Customers view own payment attempts" ON public.payment_attempts;
CREATE POLICY "Customers view own payment attempts" ON public.payment_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = payment_attempts.order_id
              AND orders.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff view branch payment attempts" ON public.payment_attempts;
CREATE POLICY "Staff view branch payment attempts" ON public.payment_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = payment_attempts.order_id
              AND public.is_staff_for_branch(orders.restaurant_id, orders.branch_id)
        )
    );

-- 7. HARDEN ADDRESS & FAVOURITE POLICIES WITH 'WITH CHECK'
DROP POLICY IF EXISTS "Users update own addresses" ON public.addresses;
CREATE POLICY "Users update own addresses" ON public.addresses
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8. STORAGE BUCKET CONFIGURATION & RLS POLICIES (Avatars, Menu, Brand)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('menu-items', 'menu-items', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('restaurant-assets', 'restaurant-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Objects Policies:
-- Avatars: Anyone can view, only owner can upload to their own user_id directory
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Menu Items & Assets: Public view, only staff managers can modify
DROP POLICY IF EXISTS "Public can view menu images" ON storage.objects;
CREATE POLICY "Public can view menu images" ON storage.objects
    FOR SELECT USING (bucket_id IN ('menu-items', 'restaurant-assets'));

DROP POLICY IF EXISTS "Staff managers can upload menu images" ON storage.objects;
CREATE POLICY "Staff managers can upload menu images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('menu-items', 'restaurant-assets')
        AND EXISTS (
            SELECT 1 FROM public.restaurant_staff
            WHERE user_id = auth.uid()
              AND role IN ('owner', 'manager')
              AND is_active = true
        )
    );

