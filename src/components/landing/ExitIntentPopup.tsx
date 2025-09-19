'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, GiftIcon } from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  email: string;
  phone: string;
  drivingLevel: string;
  preferredLocation: string;
  hearAboutUs: string;
}

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    drivingLevel: '',
    preferredLocation: '',
    hearAboutUs: ''
  });

  useEffect(() => {
    let hasTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page and hasn't triggered before
      if (e.clientY <= 0 && !hasTriggered && !isSubmitted) {
        hasTriggered = true;
        setIsVisible(true);
      }
    };

    // Also trigger after 30 seconds if user hasn't triggered it yet
    const timer = setTimeout(() => {
      if (!hasTriggered && !isSubmitted) {
        hasTriggered = true;
        setIsVisible(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [isSubmitted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save to CRM/database
      const response = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'Exit Intent Popup',
          notes: 'Free lesson claim - Exit intent capture'
        }),
      });

      if (response.ok) {
        // Send WhatsApp message
        const whatsappMessage = `🎁 FREE LESSON CLAIM - Exit Intent
        
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Driving Level: ${formData.drivingLevel}
Preferred Location: ${formData.preferredLocation}
How they heard about us: ${formData.hearAboutUs}

They were about to leave but claimed the free lesson offer!`;

        window.open(`https://wa.me/447756183484?text=${encodeURIComponent(whatsappMessage)}`, '_blank');

        setIsSubmitted(true);
        
        // Hide popup after showing success message
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again or contact us directly.');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors z-10"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white text-center">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                >
                  <GiftIcon className="w-16 h-16 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Don&apos;t Go Yet!</h2>
                <p className="text-lg">Claim Your <strong>1 Hour FREE Lesson</strong></p>
                <div className="text-sm mt-2 bg-red-600 bg-opacity-50 rounded-lg px-3 py-1 inline-block">
                  ⏰ Limited Time Offer - Expires Soon!
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="drivingLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Driving Experience Level *
                  </label>
                  <select
                    id="drivingLevel"
                    name="drivingLevel"
                    value={formData.drivingLevel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select your level</option>
                    <option value="Complete Beginner">Complete Beginner</option>
                    <option value="Some Experience">Some Experience</option>
                    <option value="Had Lessons Before">Had Lessons Before</option>
                    <option value="Test Ready">Test Ready</option>
                    <option value="Refresher Needed">Refresher Needed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="preferredLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Location
                  </label>
                  <select
                    id="preferredLocation"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a location</option>
                    <option value="Birmingham">Birmingham</option>
                    <option value="Manchester">Manchester</option>
                    <option value="London">London</option>
                    <option value="Leeds">Leeds</option>
                    <option value="Bristol">Bristol</option>
                    <option value="Edinburgh">Edinburgh</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="hearAboutUs" className="block text-sm font-medium text-gray-700 mb-1">
                    How did you hear about us?
                  </label>
                  <select
                    id="hearAboutUs"
                    name="hearAboutUs"
                    value={formData.hearAboutUs}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Please select</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Friend/Family">Friend/Family Recommendation</option>
                    <option value="Online Advertisement">Online Advertisement</option>
                    <option value="Comparison Website">Comparison Website</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🎁 Claim My FREE Lesson Now!
                </motion.button>

                <div className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to be contacted by DriveSchool Pro. 
                  Your information will be kept confidential.
                </div>
              </form>
            </>
          ) : (
            // Success Message
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 Congratulations!
              </h2>
              <p className="text-gray-600 mb-6">
                Your FREE lesson has been reserved! Our team will contact you within 24 hours to schedule your lesson.
              </p>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✅ Confirmation email sent</li>
                  <li>✅ WhatsApp message dispatched</li>
                  <li>✅ Instructor assignment in progress</li>
                  <li>✅ We&apos;ll call you within 24 hours</li>
                </ul>
              </div>

              <motion.button
                onClick={handleClose}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}