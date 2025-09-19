'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Gift, Car, Clock, CheckCircle } from 'lucide-react';

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; phone: string; name: string }) => void;
}

export default function ExitIntentPopup({ isOpen, onClose, onSubmit }: ExitIntentPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.phone || !formData.name) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Send form data to email API
      const response = await fetch('/api/email/send-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'exit-intent',
          data: formData,
          customerEmail: formData.email,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Call the parent's onSubmit for any additional handling
        await onSubmit(formData);
        setIsSubmitted(true);
        
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
          setFormData({ name: '', email: '', phone: '' });
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try contacting us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in-up">
      <Card className="w-full max-w-md mx-auto animate-scale-in shadow-2xl border-0">
        {!isSubmitted ? (
          <>
            <CardHeader className="relative text-center bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8" />
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold mb-2">
                Wait! Don't Miss Out
              </CardTitle>
              <p className="text-white/90">
                Get your <span className="font-bold text-yellow-300">FREE 1-Hour Lesson</span> before you leave!
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Absolutely FREE - No hidden costs</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Professional qualified instructor</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>No obligation to continue</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Available in your area</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="popup-name">Full Name *</Label>
                  <Input
                    id="popup-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="popup-email">Email Address *</Label>
                  <Input
                    id="popup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="popup-phone">Phone Number *</Label>
                  <Input
                    id="popup-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+44 7123 456789"
                    required
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.email || !formData.phone || !formData.name}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Claiming Your Free Lesson...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 mr-2" />
                      Claim My FREE Lesson Now!
                    </>
                  )}
                </Button>
              </form>

              {/* Trust Indicators */}
              <div className="text-center text-xs text-gray-500 space-y-1">
                <p>🔒 Your information is secure and will never be shared</p>
                <p>⏰ Offer expires in 24 hours</p>
              </div>

              {/* Alternative Action */}
              <div className="text-center">
                <button
                  onClick={onClose}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  No thanks, I'll pay full price later
                </button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Success!</h3>
              <p className="text-gray-600">
                Your FREE lesson has been reserved! We'll contact you within 24 hours to schedule your lesson.
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 justify-center text-green-800">
                <Car className="w-5 h-5" />
                <span className="font-medium">Free Lesson Confirmed</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Check your email for confirmation details
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}