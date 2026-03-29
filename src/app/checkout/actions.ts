'use server';

import Stripe from 'stripe';
import { headers } from 'next/headers';

type Plan = 'weekly' | 'monthly' | 'yearly';

const PRICE_IDS: Record<Plan, string | undefined> = {
  weekly: process.env.STRIPE_WEEKLY_PRICE_ID,
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
  yearly: process.env.STRIPE_YEARLY_PRICE_ID,
};

function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;

  if (!secret) {
    throw new Error('STRIPE_SECRET_KEY is not set.');
  }

  return new Stripe(secret, {
    apiVersion: '2024-06-20',
    typescript: true,
  });
}

export async function createSubscriptionCheckoutSession(
  plan: Plan,
  userId: string
): Promise<{ url: string }> {
  try {
    const h = await headers();
    const origin = h.get('origin') || 'https://wanderwise.uk';

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      throw new Error(
        `Missing PRICE ID for plan "${plan}". Check STRIPE_${plan.toUpperCase()}_PRICE_ID.`
      );
    }

    if (!priceId.startsWith('price_')) {
      throw new Error(
        `Invalid Price ID for "${plan}". Expected value starting with "price_".`
      );
    }

    const stripe = getStripe();

    const successUrl = `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/pricing`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      metadata: {
        plan,
        userId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      throw new Error('Stripe session created but no URL was returned.');
    }

    return { url: session.url };
  } catch (err: any) {
    console.error('Stripe create checkout session failed:', err);
    throw new Error(err?.message || 'Failed to create Stripe checkout session.');
  }
}

export async function verifyCheckoutSession(sessionId: string): Promise<{
  isPaid: boolean;
  plan: Plan | null;
  userId: string | null;
  subscriptionId: string | null;
  customerId: string | null;
  currentPeriodEnd: string | null;
}> {
  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    const subscription =
      typeof session.subscription === 'string'
        ? await stripe.subscriptions.retrieve(session.subscription)
        : session.subscription;

    const currentPeriodEnd =
      subscription && 'current_period_end' in subscription && subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;

    const subscriptionId =
      subscription && 'id' in subscription ? subscription.id : null;

    const customerId =
      typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id || null;

    const plan =
      ((session.metadata?.plan || subscription?.metadata?.plan) as Plan | undefined) || null;

    const userId =
      session.client_reference_id ||
      session.metadata?.userId ||
      subscription?.metadata?.userId ||
      null;

    return {
      isPaid: session.payment_status === 'paid',
      plan,
      userId,
      subscriptionId,
      customerId,
      currentPeriodEnd,
    };
  } catch (err) {
    console.error('Stripe verify session failed:', err);
    return {
      isPaid: false,
      plan: null,
      userId: null,
      subscriptionId: null,
      customerId: null,
      currentPeriodEnd: null,
    };
  }
}

export async function cancelUserSubscription(subscriptionId: string): Promise<{
  success: boolean;
  message: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  status: string | null;
}> {
  try {
    if (!subscriptionId) {
      throw new Error('Missing Stripe subscription ID.');
    }

    const stripe = getStripe();

    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return {
      success: true,
      message: 'Subscription will cancel at the end of the current billing period.',
      cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end ?? false,
      currentPeriodEnd: updatedSubscription.current_period_end
        ? new Date(updatedSubscription.current_period_end * 1000).toISOString()
        : null,
      status: updatedSubscription.status || null,
    };
  } catch (err: any) {
    console.error('Stripe cancel subscription failed:', err);
    return {
      success: false,
      message: err?.message || 'Failed to cancel subscription.',
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
      status: null,
    };
  }
}

