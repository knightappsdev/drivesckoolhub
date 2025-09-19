'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
  CreditCardIcon, 
  LockClosedIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { COURSE_PRICES, CourseType, formatPrice } from '@/lib/stripe';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  courseType: CourseType;
  instructorId?: number;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

export default function PaymentForm({ courseType, instructorId, onSuccess, onError }: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent
        courseType={courseType}
        instructorId={instructorId}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}

function PaymentFormContent({ courseType, instructorId, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const course = COURSE_PRICES[courseType];

  // Create payment intent when component mounts
  useEffect(() => {
    createPaymentIntent();
  }, [courseType, instructorId]);

  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseType,
          instructorId,
          metadata: {
            source: 'course_booking',
          },
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setClientSecret(data.data.clientSecret);
      } else {
        throw new Error(data.error || 'Failed to create payment intent');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize payment');
      setPaymentStatus('error');
      onError?.(error instanceof Error ? error.message : 'Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Card element not found');
      setIsProcessing(false);
      return;
    }

    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    setIsProcessing(false);

    if (error) {
      setErrorMessage(error.message || 'Payment failed');
      setPaymentStatus('error');
      onError?.(error.message || 'Payment failed');
      toast.error(error.message || 'Payment failed');
    } else if (paymentIntent?.status === 'succeeded') {
      setPaymentStatus('success');
      onSuccess?.(paymentIntent.id);
      toast.success('Payment successful! Your course has been booked.');
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center">
          <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin mr-3" />
          <span className="text-lg text-gray-600">Initializing payment...</span>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
        >
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-6">
          Your {course.name} has been booked successfully. You'll receive a confirmation email shortly.
        </p>
        
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-800 mb-2">Course Details:</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Course:</strong> {course.name}</p>
            <p><strong>Duration:</strong> {course.hours} hours ({course.lessons} lessons)</p>
            <p><strong>Amount Paid:</strong> {formatPrice(course.price)}</p>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Our team will contact you within 24 hours to schedule your first lesson.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
        <div className="flex items-center">
          <CreditCardIcon className="w-8 h-8 mr-3" />
          <div>
            <h3 className="text-xl font-bold">Secure Payment</h3>
            <p className="text-blue-100">Complete your course booking</p>
          </div>
        </div>
      </div>

      {/* Course Summary */}
      <div className="px-8 py-6 bg-gray-50 border-b">
        <h4 className="font-semibold text-gray-900 mb-3">Course Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Course:</span>
            <span className="font-medium">{course.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{course.hours} hours ({course.lessons} lessons)</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span>{formatPrice(course.price)}</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="p-8">
        {paymentStatus === 'error' && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 font-medium">Payment Failed</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
          </motion.div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center text-sm text-gray-500 mb-6">
          <LockClosedIcon className="w-4 h-4 mr-1" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!stripe || isProcessing || !clientSecret}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
              Processing Payment...
            </div>
          ) : (
            `Pay ${formatPrice(course.price)} Now`
          )}
        </motion.button>

        {/* Payment Methods */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-3">Accepted payment methods:</p>
          <div className="flex justify-center space-x-4">
            <img src="/payment-icons/visa.png" alt="Visa" className="h-6 opacity-60" onError={(e) => e.currentTarget.style.display = 'none'} />
            <img src="/payment-icons/mastercard.png" alt="Mastercard" className="h-6 opacity-60" onError={(e) => e.currentTarget.style.display = 'none'} />
            <img src="/payment-icons/amex.png" alt="American Express" className="h-6 opacity-60" onError={(e) => e.currentTarget.style.display = 'none'} />
            <span className="text-xs text-gray-400 self-center">+ more</span>
          </div>
        </div>
      </form>
    </motion.div>
  );
}