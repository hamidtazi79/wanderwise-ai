import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 🔐 Initialize Firebase Admin (server side)
if (!getApps().length) {
  initializeApp({
    credential: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    } as any,
  });
}

const db = getFirestore();

// 🔐 Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

// 🔐 Webhook secret (you will set this later)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed.', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('✅ Webhook received:', event.type);

    // 🎯 Handle events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.client_reference_id;
        const plan = session.metadata?.plan;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (!userId) break;

        await db.collection('users').doc(userId).update({
          subscriptionStatus: plan || 'free',
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
          subscriptionCancelAtPeriodEnd: false,
          updatedAt: new Date().toISOString(),
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        const cancelAtPeriodEnd = subscription.cancel_at_period_end;
        const currentPeriodEnd = new Date(
          subscription.current_period_end * 1000
        ).toISOString();

        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id;

        // 🔎 Find user by stripeCustomerId
        const users = await db
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .get();

        for (const docSnap of users.docs) {
          await docSnap.ref.update({
            subscriptionCancelAtPeriodEnd: cancelAtPeriodEnd,
            subscriptionCurrentPeriodEnd: currentPeriodEnd,
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

        const users = await db
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .get();

        for (const docSnap of users.docs) {
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
            : invoice.customer?.id;

        if (!customerId) break;

        const users = await db
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .get();

        for (const docSnap of users.docs) {
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
    console.error('🔥 Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
