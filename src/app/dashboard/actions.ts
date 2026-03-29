'use server';

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

function getStripe() {
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set.');
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2024-06-20',
    typescript: true,
  });
}

export async function cancelStripeSubscriptionAtPeriodEnd(
  subscriptionId: string
): Promise<{
  success: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
}> {
  try {
    if (!subscriptionId) {
      throw new Error('Missing Stripe subscription ID.');
    }

    const stripe = getStripe();

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return {
      success: true,
      cancelAtPeriodEnd: !!subscription.cancel_at_period_end,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
    };
  } catch (error: any) {
    console.error('Stripe cancel subscription failed:', error);
    throw new Error(
      error?.message || 'Failed to cancel subscription in Stripe.'
    );
  }
}
