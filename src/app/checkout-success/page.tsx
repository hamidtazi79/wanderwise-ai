'use server';

import Stripe from 'stripe';
import { headers } from 'next/headers';

type Plan = 'weekly' | 'monthly' | 'yearly';

const PRICE_IDS: Record<Plan, string | undefined> = {
  weekly: process.env.STRIPE_WEEKLY_PRICE_ID,
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
  yearly: process.env.STRIPE_YEARLY_PRICE_ID,
};

export async function createSubscriptionCheckoutSession(
  plan: Plan,
  userId: string
): Promise<{ url: string }> {
  try {
    const h = await headers();
    const origin = h.get('origin') || 'https://wanderwise.uk';

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Please add it to your environment variables.'
      );
    }

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      throw new Error(
        `Missing PRICE ID for plan "${plan}". Check STRIPE_${plan.toUpperCase()}_PRICE_ID in your environment variables.`
      );
    }

    if (!priceId.startsWith('price_')) {
      throw new Error(
        `Invalid Price ID for "${plan}". Expected a Stripe Price ID starting with "price_".`
      );
    }

    const stripe = new Stripe(secret, {
      apiVersion: '2024-06-20',
      typescript: true,
    });

    const successUrl = `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/pricing`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      metadata: { plan, userId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      throw new Error('Stripe session created but no URL was returned.');
    }

    return { url: session.url };
  } catch (err: any) {
    console.error('Stripe create checkout session failed:', err.message);
    throw new Error(err.message || 'An unknown Stripe error occurred.');
  }
}

export async function verifyCheckoutSession(
  sessionId: string
): Promise<{
  isPaid: boolean;
  plan: Plan | null;
  userId: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}> {
  const secret = process.env.STRIPE_SECRET_KEY;

  if (!secret) {
    console.error('STRIPE_SECRET_KEY is not set for session verification.');
    return {
      isPaid: false,
      plan: null,
      userId: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
  }

  const stripe = new Stripe(secret, {
    apiVersion: '2024-06-20',
    typescript: true,
  });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      isPaid: session.payment_status === 'paid',
      plan: (session.metadata?.plan as Plan) || null,
      userId: session.client_reference_id || null,
      stripeCustomerId:
        typeof session.customer === 'string' ? session.customer : null,
      stripeSubscriptionId:
        typeof session.subscription === 'string' ? session.subscription : null,
    };
  } catch (err) {
    console.error('Stripe verify session failed:', err);
    return {
      isPaid: false,
      plan: null,
      userId: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
  }
}
