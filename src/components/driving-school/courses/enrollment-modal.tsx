'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  X,
  CreditCard,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  price: number;
  duration: string;
  startDate: string;
  location: string;
  instructor: string;
  availability: number;
}

interface EnrollmentModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EnrollmentModal({ 
  course, 
  isOpen, 
  onClose, 
  onSuccess 
}: EnrollmentModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    licenseNumber: '',
    experience: 'none',
    preferredTime: 'morning',
    specialRequests: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreeTerms: false,
    agreeMarketing: false
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: '',
    city: '',
    postcode: '',
    paymentType: 'full' as 'full' | 'deposit'
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 'details') {
      setStep('payment');
    } else if (step === 'payment') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          ...formData,
          ...paymentData
        })
      });

      if (response.ok) {
        setStep('confirmation');
      } else {
        throw new Error('Enrollment failed');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 'details') {
      return formData.firstName && formData.lastName && formData.email && 
             formData.phone && formData.dateOfBirth && formData.agreeTerms;
    } else if (step === 'payment') {
      return paymentData.cardNumber && paymentData.expiryDate && 
             paymentData.cvv && paymentData.nameOnCard;
    }
    return true;
  };

  const depositAmount = Math.round(course.price * 0.3);
  const finalAmount = paymentData.paymentType === 'full' ? course.price : depositAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Enroll in Course</h2>
            <p className="text-gray-600">{course.title}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center p-4 border-b">
          {['Details', 'Payment', 'Confirmation'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                (step === 'details' && index === 0) ||
                (step === 'payment' && index <= 1) ||
                (step === 'confirmation' && index <= 2)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                (step === 'details' && index === 0) ||
                (step === 'payment' && index <= 1) ||
                (step === 'confirmation' && index <= 2)
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600'
              }`}>
                {stepName}
              </span>
              {index < 2 && <div className="w-8 h-px bg-gray-300 ml-4 mr-4" />}
            </div>
          ))}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 'details' && (
            <div className="space-y-6">
              {/* Course Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Start: {new Date(course.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Duration: {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>Location: {course.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Instructor: {course.instructor}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Cost:</span>
                      <span className="text-xl font-bold text-blue-600">£{course.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name *</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">License Number</label>
                    <Input
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      placeholder="Enter license number (if any)"
                    />
                  </div>
                </div>
              </div>

              {/* Driving Experience */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Driving Experience</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience Level</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="none">Complete beginner</option>
                    <option value="some">Some experience</option>
                    <option value="refresher">Need refresher</option>
                    <option value="test-prep">Test preparation only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Lesson Time</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="morning">Morning (9am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 5pm)</option>
                    <option value="evening">Evening (5pm - 8pm)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Name</label>
                    <Input
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Phone</label>
                    <Input
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      placeholder="Emergency contact phone"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium mb-1">Special Requests or Medical Conditions</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requirements, medical conditions, or accessibility needs..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={formData.agreeMarketing}
                    onChange={(e) => handleInputChange('agreeMarketing', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    I would like to receive marketing communications and course updates
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              {/* Payment Options */}
              <div>
                <h3 className="font-medium text-lg mb-4">Payment Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer border-2 ${paymentData.paymentType === 'full' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => handlePaymentChange('paymentType', 'full')}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-bold">£{course.price}</div>
                      <div className="text-sm text-gray-600">Pay in Full</div>
                      <div className="text-xs text-green-600 mt-1">Save 5%</div>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer border-2 ${paymentData.paymentType === 'deposit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => handlePaymentChange('paymentType', 'deposit')}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-bold">£{depositAmount}</div>
                      <div className="text-sm text-gray-600">Deposit (30%)</div>
                      <div className="text-xs text-gray-500 mt-1">Remaining: £{course.price - depositAmount}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Payment Details</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number *</label>
                  <Input
                    value={paymentData.cardNumber}
                    onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Expiry Date *</label>
                    <Input
                      value={paymentData.expiryDate}
                      onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV *</label>
                    <Input
                      value={paymentData.cvv}
                      onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Name on Card *</label>
                  <Input
                    value={paymentData.nameOnCard}
                    onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                    placeholder="Cardholder name"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Billing Address</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    value={paymentData.billingAddress}
                    onChange={(e) => handlePaymentChange('billingAddress', e.target.value)}
                    placeholder="Enter billing address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input
                      value={paymentData.city}
                      onChange={(e) => handlePaymentChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postcode</label>
                    <Input
                      value={paymentData.postcode}
                      onChange={(e) => handlePaymentChange('postcode', e.target.value)}
                      placeholder="Postcode"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Course: {course.title}</span>
                      <span>£{course.price}</span>
                    </div>
                    {paymentData.paymentType === 'full' && (
                      <div className="flex justify-between text-green-600">
                        <span>Early payment discount (5%)</span>
                        <span>-£{Math.round(course.price * 0.05)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total {paymentData.paymentType === 'deposit' ? 'Deposit' : 'Amount'}:</span>
                      <span>£{paymentData.paymentType === 'full' ? Math.round(course.price * 0.95) : depositAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <div className="font-medium mb-1">Secure Payment</div>
                    <div>Your payment information is encrypted and secure. You will receive a confirmation email after successful payment.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Successful!</h3>
                <p className="text-gray-600">
                  Welcome to {course.title}! You're all set to begin your driving journey.
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-medium mb-4">What's Next?</h4>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Confirmation Email</div>
                        <div className="text-sm text-gray-600">Check your email for course details and receipt</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Instructor Contact</div>
                        <div className="text-sm text-gray-600">Your instructor will contact you within 24 hours</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Course Materials</div>
                        <div className="text-sm text-gray-600">Access your student portal for resources and schedules</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-sm text-gray-600">
                <p>Questions? Contact us at <a href="mailto:support@driveschoolpro.com" className="text-blue-600 hover:underline">support@driveschoolpro.com</a></p>
                <p>or call us at <a href="tel:+441234567890" className="text-blue-600 hover:underline">+44 123 456 7890</a></p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'confirmation' && (
          <div className="border-t p-6">
            <div className="flex justify-between">
              {step === 'payment' ? (
                <Button variant="outline" onClick={() => setStep('details')}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!isStepValid() || loading}
                  className="px-8"
                >
                  {loading ? 'Processing...' : step === 'details' ? 'Continue to Payment' : 'Complete Enrollment'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="border-t p-6 text-center">
            <Button onClick={() => { onSuccess(); onClose(); }} className="px-8">
              Return to Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}