import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is missing');
}

if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('FIREBASE_PROJECT_ID is missing');
}

if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('FIREBASE_CLIENT_EMAIL is missing');
}

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('FIREBASE_PRIVATE_KEY is missing');
}

// Initialize Firebase Admin only once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Stripe webhook received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.client_reference_id;
        const plan = session.metadata?.plan ?? 'free';
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id ?? null;
        const customerId =
          typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id ?? null;

        if (!userId) {
          break;
        }

        await db.collection('users').doc(userId).set(
          {
            subscriptionStatus: plan,
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: customerId,
            subscriptionCancelAtPeriodEnd: false,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        const cancelAtPeriodEnd = subscription.cancel_at_period_end;
        const currentPeriodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;

        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id;

        const usersSnapshot = await db
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .get();

        for (const docSnap of usersSnapshot.docs) {
          await docSnap.ref.update({
            subscriptionCancelAtPeriodEnd: cancelAtPeriodEnd,
            subscriptionCurrentPeriodEnd: currentPeriodEnd,
            stripeSubscriptionId: subscription.id,
            updatedAt: new Date().toISOString(),
          });
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id;

        const usersSnapshot = await db
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .get();

        for (const docSnap of usersSnapshot.docs) {
          await docSnap.ref.update({
            subscriptionStatus: 'free',
            stripeSubscriptionId: null,
            subscriptionCancelAtPeriodEnd: false,
            subscriptionCurrentPeriodEnd: null,
            updatedAt: new Date().toISOString(),
          });
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        const customerId =
          typeof invoice.customer === 'string'
            ? invoice.customer
            : invoice.customer?.id ?? null;

        if (!customerId) {
          break;
        }

        const usersSnapshot = await db
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .get();

        for (const docSnap of usersSnapshot.docs) {
          await docSnap.ref.update({
            subscriptionStatus: 'past_due',
            updatedAt: new Date().toISOString(),
          });
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
