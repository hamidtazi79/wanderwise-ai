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

type CancelResult = {
  success: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  status: string | null;
  subscriptionId: string | null;
  customerId: string | null;
  message: string;
};

export async function cancelStripeSubscriptionAtPeriodEnd(params: {
  subscriptionId?: string | null;
  email?: string | null;
}): Promise<CancelResult> {
  try {
    const stripe = getStripe();

    let foundSubscriptionId = params.subscriptionId || null;
    let foundCustomerId: string | null = null;

    // First try direct subscription ID
    if (foundSubscriptionId) {
      const updatedSubscription = await stripe.subscriptions.update(
        foundSubscriptionId,
        {
          cancel_at_period_end: true,
        }
      );

      return {
        success: true,
        cancelAtPeriodEnd: !!updatedSubscription.cancel_at_period_end,
        currentPeriodEnd: updatedSubscription.current_period_end
          ? new Date(updatedSubscription.current_period_end * 1000).toISOString()
          : null,
        status: updatedSubscription.status || null,
        subscriptionId: updatedSubscription.id,
        customerId:
          typeof updatedSubscription.customer === 'string'
            ? updatedSubscription.customer
            : updatedSubscription.customer?.id || null,
        message:
          'Subscription will cancel at the end of the current billing period.',
      };
    }

    // Fallback for older users: find Stripe customer by email
    if (!params.email) {
      throw new Error(
        'Missing Stripe subscription ID and customer email. Cannot locate subscription.'
      );
    }

    const customers = await stripe.customers.list({
      email: params.email,
      limit: 10,
    });

    if (!customers.data.length) {
      throw new Error('No Stripe customer found for this email.');
    }

    // Try each matching customer until we find an active/trialing subscription
    for (const customer of customers.data) {
      foundCustomerId = customer.id;

      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 20,
      });

      const activeSubscription = subscriptions.data.find(
        (sub) =>
          (sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due') &&
          !sub.cancel_at_period_end
      );

      if (!activeSubscription) {
        continue;
      }

      foundSubscriptionId = activeSubscription.id;

      const updatedSubscription = await stripe.subscriptions.update(
        foundSubscriptionId,
        {
          cancel_at_period_end: true,
        }
      );

      return {
        success: true,
        cancelAtPeriodEnd: !!updatedSubscription.cancel_at_period_end,
        currentPeriodEnd: updatedSubscription.current_period_end
          ? new Date(updatedSubscription.current_period_end * 1000).toISOString()
          : null,
        status: updatedSubscription.status || null,
        subscriptionId: updatedSubscription.id,
        customerId:
          typeof updatedSubscription.customer === 'string'
            ? updatedSubscription.customer
            : updatedSubscription.customer?.id || null,
        message:
          'Subscription will cancel at the end of the current billing period.',
      };
    }

    throw new Error(
      'No active Stripe subscription found for this account.'
    );
  } catch (error: any) {
    console.error('Stripe cancel subscription failed:', error);

    return {
      success: false,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
      status: null,
      subscriptionId: null,
      customerId: null,
      message:
        error?.message || 'Failed to cancel subscription in Stripe.',
    };
  }
}

