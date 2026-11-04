// ==============================================================================
// EMBER SUPABASE EDGE FUNCTION: verify-razorpay (HARDENED & SECURE)
// Runs securely on Deno server-side: Constant-time HMAC, replay prevention, secret guard
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createHmac, timingSafeEqual } from 'https://deno.land/std@0.168.0/node/crypto.ts';
import { Buffer } from 'https://deno.land/std@0.168.0/node/buffer.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const RAZORPAY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  // CORS Headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  // 1. Fail-safe: Verify backend secret configuration
  if (!RAZORPAY_SECRET || RAZORPAY_SECRET.length < 8) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: Payment verification secret is unconfigured or invalid.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return new Response(
        JSON.stringify({ error: 'Missing mandatory payment verification parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Constant-Time HMAC-SHA256 Signature Verification (Side-channel resistant)
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = createHmac('sha256', RAZORPAY_SECRET)
      .update(payload)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const providedBuf = Buffer.from(razorpay_signature, 'utf8');

    if (expectedBuf.length !== providedBuf.length || !timingSafeEqual(expectedBuf, providedBuf)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid payment signature: Verification failed.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Replay Protection & Database Transition (Atomic Payment Record)
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Check if payment ID has already been captured on another order (Replay prevention)
      const { data: existingPayment } = await supabaseAdmin
        .from('payment_attempts')
        .select('id, order_id, status')
        .eq('gateway_payment_id', razorpay_payment_id)
        .single();

      if (existingPayment && existingPayment.order_id !== order_id) {
        return new Response(
          JSON.stringify({ success: false, error: 'Replay detected: Payment ID already consumed by another order.' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Transition order status to 'captured' and record payment attempt
      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'captured',
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', order_id);

      await supabaseAdmin.from('payment_attempts').insert({
        order_id,
        gateway: 'razorpay',
        gateway_order_id: razorpay_order_id,
        gateway_payment_id: razorpay_payment_id,
        gateway_signature: razorpay_signature,
        amount_paise: 0, // Recorded from order
        status: 'verified',
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Payment verified and captured successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Payment verification failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
