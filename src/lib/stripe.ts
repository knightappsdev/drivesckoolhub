import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Client-side Stripe instance
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Payment status mapping
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing', 
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// Course pricing (in pence for GBP)
export const COURSE_PRICES = {
  'absolute_beginner': {
    name: 'Absolute Beginner Course',
    price: 89900, // £899.00 in pence
    description: 'Complete course for absolute beginners with 40 hours of instruction',
    hours: 40,
    lessons: 20,
  },
  'beginner': {
    name: 'Beginner Course', 
    price: 69900, // £699.00 in pence
    description: 'Structured course for beginners with 30 hours of instruction',
    hours: 30,
    lessons: 15,
  },
  'intermediate': {
    name: 'Intermediate Course',
    price: 49900, // £499.00 in pence
    description: 'Advanced course for intermediate drivers with 20 hours of instruction',
    hours: 20,
    lessons: 10,
  },
  'flexi': {
    name: 'Flexi Course',
    price: 39900, // £399.00 in pence
    description: 'Flexible course that adapts to your schedule and needs',
    hours: 15,
    lessons: 8,
  },
} as const;

export type CourseType = keyof typeof COURSE_PRICES;

// Helper function to format price for display
export const formatPrice = (priceInPence: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(priceInPence / 100);
};

// Helper function to create payment intent
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'gbp',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  });
};

// Helper function to create subscription
export const createSubscription = async (
  customerId: string,
  priceId: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Subscription> => {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata,
  });
};

// Helper function to create or retrieve customer
export const createOrRetrieveCustomer = async (
  email: string,
  name?: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Customer> => {
  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
};

// Helper function to retrieve payment intent
export const retrievePaymentIntent = async (paymentIntentId: string): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};

// Helper function to handle webhook signature verification
export const constructWebhookEvent = (
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event => {
  return stripe.webhooks.constructEvent(payload, signature, secret);
};

// Payment method types
export const PAYMENT_METHOD_TYPES = {
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  DIRECT_DEBIT: 'bacs_debit',
} as const;

// Refund helper
export const createRefund = async (
  paymentIntentId: string,
  amount?: number,
  reason?: Stripe.RefundCreateParams.Reason
): Promise<Stripe.Refund> => {
  const params: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  };
  
  if (amount) params.amount = amount;
  if (reason) params.reason = reason;

  return await stripe.refunds.create(params);
};