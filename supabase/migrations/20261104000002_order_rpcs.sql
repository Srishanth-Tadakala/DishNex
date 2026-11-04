-- ==============================================================================
-- EMBER — TRANSACTIONAL ORDER CREATION & VALIDATION RPC (AUDITED & HARDENED)
-- Enforces server-side price validation, availability, fees, coupons & idempotency
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.create_customer_order(
    p_restaurant_id UUID,
    p_branch_id UUID,
    p_order_type TEXT,
    p_table_identifier TEXT,
    p_delivery_address_id UUID,
    p_special_instructions TEXT,
    p_coupon_code TEXT,
    p_payment_method TEXT,
    p_items JSONB, -- Array of { menu_item_id, quantity, selected_addons: [{id, name, price_paise}] }
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_order_id UUID;
    v_order_number TEXT;
    v_item RECORD;
    v_db_item RECORD;
    v_subtotal_paise INTEGER := 0;
    v_item_subtotal_paise INTEGER;
    v_item_unit_paise INTEGER;
    v_item_addon_total INTEGER;
    v_addon RECORD;
    v_addon_price INTEGER;
    v_tax_rate NUMERIC;
    v_tax_paise INTEGER := 0;
    v_packaging_fee_paise INTEGER := 0;
    v_delivery_fee_paise INTEGER := 0;
    v_discount_paise INTEGER := 0;
    v_coupon_id UUID := NULL;
    v_coupon_type TEXT;
    v_coupon_value INTEGER;
    v_min_order_amount INTEGER;
    v_max_discount INTEGER;
    v_total_paise INTEGER := 0;
    v_address_snapshot JSONB := NULL;
    v_existing_order RECORD;
BEGIN
    -- 1. Identify and authenticate caller
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to place an order.';
    END IF;

    -- 2. Idempotency Check (Return existing order atomically to prevent duplicate charges)
    IF p_idempotency_key IS NOT NULL AND TRIM(p_idempotency_key) != '' THEN
        SELECT id, user_id, order_number, total_paise, subtotal_paise, tax_paise
        INTO v_existing_order
        FROM public.orders 
        WHERE idempotency_key = p_idempotency_key;

        IF FOUND THEN
            IF v_existing_order.user_id <> v_user_id THEN
                RAISE EXCEPTION 'Idempotency conflict: Key already associated with another customer order.';
            END IF;

            RETURN jsonb_build_object(
                'success', true,
                'order_id', v_existing_order.id,
                'order_number', v_existing_order.order_number,
                'total_paise', v_existing_order.total_paise,
                'subtotal_paise', v_existing_order.subtotal_paise,
                'tax_paise', v_existing_order.tax_paise,
                'idempotent_replay', true
            );
        END IF;
    END IF;

    -- 3. Branch verification & Fee settings
    SELECT tax_rate_percent, packaging_fee_paise, delivery_fee_base_paise 
    INTO v_tax_rate, v_packaging_fee_paise, v_delivery_fee_paise
    FROM public.restaurant_branches 
    WHERE id = p_branch_id AND restaurant_id = p_restaurant_id AND is_accepting_orders = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Selected restaurant branch is currently not accepting orders.';
    END IF;

    -- Adjust fees based on order mode
    IF p_order_type = 'dine_in' THEN
        v_packaging_fee_paise := 0;
        v_delivery_fee_paise := 0;
    ELSIF p_order_type = 'takeaway' THEN
        v_delivery_fee_paise := 0;
    END IF;

    -- 4. Validate Delivery Address if delivery order
    IF p_order_type = 'delivery' THEN
        IF p_delivery_address_id IS NULL THEN
            RAISE EXCEPTION 'Delivery address is required for delivery orders.';
        END IF;

        SELECT jsonb_build_object(
            'id', id,
            'recipient_name', recipient_name,
            'phone_number', phone_number,
            'street_address', street_address,
            'city', city,
            'state', state,
            'postal_code', postal_code
        ) INTO v_address_snapshot
        FROM public.addresses 
        WHERE id = p_delivery_address_id AND user_id = v_user_id;

        IF v_address_snapshot IS NULL THEN
            RAISE EXCEPTION 'Specified delivery address was not found or does not belong to the authenticated user.';
        END IF;
    END IF;

    -- 5. Calculate line items strictly from authoritative database prices
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item.';
    END IF;

    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
        menu_item_id UUID,
        quantity INTEGER,
        selected_addons JSONB
    )
    LOOP
        -- Fetch authentic item from DB
        SELECT id, name, price_paise, is_available 
        INTO v_db_item
        FROM public.menu_items 
        WHERE id = v_item.menu_item_id AND restaurant_id = p_restaurant_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Menu item % not found.', v_item.menu_item_id;
        END IF;

        IF NOT v_db_item.is_available THEN
            RAISE EXCEPTION 'Menu item "%" is currently out of stock.', v_db_item.name;
        END IF;

        IF v_item.quantity <= 0 OR v_item.quantity > 50 THEN
            RAISE EXCEPTION 'Invalid quantity % for item "%".', v_item.quantity, v_db_item.name;
        END IF;

        -- Accumulate Add-ons accurately
        v_item_addon_total := 0;
        IF v_item.selected_addons IS NOT NULL AND jsonb_array_length(v_item.selected_addons) > 0 THEN
            FOR v_addon IN SELECT * FROM jsonb_to_recordset(v_item.selected_addons) AS a(
                id UUID,
                price_paise INTEGER
            )
            LOOP
                -- Authoritative lookup on addon price from database
                SELECT price_paise INTO v_addon_price 
                FROM public.menu_item_addons 
                WHERE id = v_addon.id AND menu_item_id = v_db_item.id AND is_available = true;

                IF NOT FOUND THEN
                    RAISE EXCEPTION 'Addon % for item "%" is invalid or unavailable.', v_addon.id, v_db_item.name;
                END IF;

                v_item_addon_total := v_item_addon_total + v_addon_price;
            END LOOP;
        END IF;

        v_item_unit_paise := v_db_item.price_paise + v_item_addon_total;
        v_item_subtotal_paise := v_item_unit_paise * v_item.quantity;
        v_subtotal_paise := v_subtotal_paise + v_item_subtotal_paise;
    END LOOP;

    -- 6. Authoritative Coupon Verification & Discount Calculation
    IF p_coupon_code IS NOT NULL AND TRIM(p_coupon_code) != '' THEN
        SELECT id, discount_type, discount_value, min_order_amount_paise, max_discount_paise
        INTO v_coupon_id, v_coupon_type, v_coupon_value, v_min_order_amount, v_max_discount
        FROM public.coupons
        WHERE code = UPPER(TRIM(p_coupon_code))
          AND is_active = true
          AND starts_at <= timezone('utc', now())
          AND expires_at >= timezone('utc', now());

        IF v_coupon_id IS NOT NULL THEN
            IF v_subtotal_paise >= v_min_order_amount THEN
                IF v_coupon_type = 'percentage' THEN
                    v_discount_paise := ROUND((v_subtotal_paise * v_coupon_value) / 100.0);
                ELSIF v_coupon_type = 'flat' THEN
                    v_discount_paise := v_coupon_value;
                END IF;

                IF v_max_discount IS NOT NULL AND v_discount_paise > v_max_discount THEN
                    v_discount_paise := v_max_discount;
                END IF;

                IF v_discount_paise > v_subtotal_paise THEN
                    v_discount_paise := v_subtotal_paise;
                END IF;
            END IF;
        END IF;
    END IF;

    -- 7. Taxes & Total Computation (GST on net subtotal after discounts)
    v_tax_paise := ROUND(((v_subtotal_paise - v_discount_paise) * v_tax_rate) / 100.0);
    v_total_paise := v_subtotal_paise - v_discount_paise + v_tax_paise + v_packaging_fee_paise + v_delivery_fee_paise;

    IF v_total_paise < 0 THEN
        v_total_paise := 0;
    END IF;

    -- Generate human-friendly order identifier (e.g. #EM683721 as seen in reference screen 14)
    v_order_number := '#EM' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');

    -- 8. Insert Order Atomically
    INSERT INTO public.orders (
        order_number,
        user_id,
        restaurant_id,
        branch_id,
        order_type,
        status,
        table_identifier,
        delivery_address_id,
        delivery_address_snapshot,
        special_instructions,
        subtotal_paise,
        discount_paise,
        coupon_id,
        tax_paise,
        packaging_fee_paise,
        delivery_fee_paise,
        total_paise,
        payment_status,
        payment_method,
        estimated_delivery_time,
        idempotency_key
    ) VALUES (
        v_order_number,
        v_user_id,
        p_restaurant_id,
        p_branch_id,
        p_order_type,
        'placed',
        p_table_identifier,
        p_delivery_address_id,
        v_address_snapshot,
        p_special_instructions,
        v_subtotal_paise,
        v_discount_paise,
        v_coupon_id,
        v_tax_paise,
        v_packaging_fee_paise,
        v_delivery_fee_paise,
        v_total_paise,
        CASE WHEN p_payment_method = 'cod' THEN 'cod' ELSE 'pending' END,
        p_payment_method,
        '30-40 mins',
        p_idempotency_key
    ) RETURNING id INTO v_order_id;

    -- 9. Insert Order Items snapshots (Unit prices reflect exact base + addons)
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
        menu_item_id UUID,
        quantity INTEGER,
        selected_addons JSONB
    )
    LOOP
        SELECT name, price_paise INTO v_db_item
        FROM public.menu_items WHERE id = v_item.menu_item_id;

        v_item_addon_total := 0;
        IF v_item.selected_addons IS NOT NULL AND jsonb_array_length(v_item.selected_addons) > 0 THEN
            FOR v_addon IN SELECT * FROM jsonb_to_recordset(v_item.selected_addons) AS a(
                id UUID,
                price_paise INTEGER
            )
            LOOP
                SELECT price_paise INTO v_addon_price 
                FROM public.menu_item_addons 
                WHERE id = v_addon.id;
                v_item_addon_total := v_item_addon_total + v_addon_price;
            END LOOP;
        END IF;

        v_item_unit_paise := v_db_item.price_paise + v_item_addon_total;

        INSERT INTO public.order_items (
            order_id,
            menu_item_id,
            item_name,
            unit_price_paise,
            quantity,
            total_price_paise,
            selected_addons
        ) VALUES (
            v_order_id,
            v_item.menu_item_id,
            v_db_item.name,
            v_item_unit_paise,
            v_item.quantity,
            v_item_unit_paise * v_item.quantity,
            COALESCE(v_item.selected_addons, '[]'::jsonb)
        );
    END LOOP;

    -- 10. Audit history record
    INSERT INTO public.order_status_history (
        order_id,
        previous_status,
        new_status,
        changed_by,
        notes
    ) VALUES (
        v_order_id,
        NULL,
        'placed',
        v_user_id,
        'Order created by customer via EMBER Mobile'
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal_paise', v_subtotal_paise,
        'discount_paise', v_discount_paise,
        'tax_paise', v_tax_paise,
        'total_paise', v_total_paise
    );
END;
$$;
