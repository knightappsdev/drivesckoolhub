'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, MessageCircle, Send, Phone } from 'lucide-react';
import { submitFormData, formatWhatsAppData } from '@/lib/utils/form-submission';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  businessName?: string;
  welcomeMessage?: string;
  isVisible?: boolean;
  showOnExitIntent?: boolean;
  onExitIntentShow?: () => void;
}

interface QuickMessage {
  id: string;
  text: string;
  label: string;
}

const defaultQuickMessages: QuickMessage[] = [
  {
    id: '1',
    text: 'Hi! I\'d like to book driving lessons. Can you help me?',
    label: 'Book Lessons'
  },
  {
    id: '2', 
    text: 'What are your course prices and packages?',
    label: 'Course Prices'
  },
  {
    id: '3',
    text: 'Do you have instructors available in my area?',
    label: 'Find Instructors'
  },
  {
    id: '4',
    text: 'I need help with theory test preparation.',
    label: 'Theory Test Help'
  }
];

export default function WhatsAppWidget({ 
  phoneNumber = '+447756183484',
  businessName = 'DriveSchool Pro',
  welcomeMessage = 'Hi! How can we help you with your driving lessons today?',
  isVisible = true,
  showOnExitIntent = false,
  onExitIntentShow
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (showOnExitIntent) {
      setIsOpen(true);
      onExitIntentShow?.();
    }
  }, [showOnExitIntent, onExitIntentShow]);

  const sendWhatsAppMessage = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleQuickMessage = async (message: QuickMessage) => {
    // Send to email API for record keeping
    try {
      const formData = formatWhatsAppData({
        message: message.text,
        type: 'quick',
        quickMessageLabel: message.label,
        userInfo,
      });
      
      await submitFormData({
        type: 'whatsapp-contact',
        data: formData,
        customerEmail: userInfo.email || undefined,
      });
    } catch (error) {
      console.error('Error logging WhatsApp message:', error);
    }
    
    sendWhatsAppMessage(message.text);
  };

  const handleCustomMessage = async () => {
    if (!customMessage.trim()) return;
    
    // If user has provided info, send with info; otherwise send directly
    if (showUserForm && (userInfo.name || userInfo.email)) {
      await sendCustomMessageWithInfo();
    } else {
      sendWhatsAppMessage(customMessage);
      setCustomMessage('');
    }
  };

  const sendCustomMessageWithInfo = async () => {
    if (!customMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Send to email API
      const formData = formatWhatsAppData({
        message: customMessage,
        type: 'custom',
        userInfo,
      });
      
      await submitFormData({
        type: 'whatsapp-contact',
        data: formData,
        customerEmail: userInfo.email || undefined,
      });
      
      // Send WhatsApp message
      sendWhatsAppMessage(customMessage);
      
      // Reset form
      setCustomMessage('');
      setUserInfo({ name: '', email: '', phone: '' });
      setShowUserForm(false);
    } catch (error) {
      console.error('Error submitting WhatsApp message:', error);
      // Still send WhatsApp message even if email fails
      sendWhatsAppMessage(customMessage);
      setCustomMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <Card className="w-80 mb-4 shadow-2xl border-0 bg-white animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="bg-green-600 text-white rounded-t-lg pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">{businessName}</CardTitle>
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Welcome Message */}
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-green-800">{welcomeMessage}</p>
            </div>

            {/* Quick Messages */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Quick Messages
              </p>
              {defaultQuickMessages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => handleQuickMessage(message)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm border border-gray-200 hover:border-green-300"
                >
                  {message.label}
                </button>
              ))}
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Custom Message
              </p>
              
              {!showUserForm ? (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleCustomMessage()}
                    />
                    <Button
                      onClick={handleCustomMessage}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 px-3"
                      disabled={!customMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {customMessage.trim() && (
                    <button
                      onClick={() => setShowUserForm(true)}
                      className="text-xs text-blue-600 hover:text-blue-700 underline"
                    >
                      + Add contact info for follow-up
                    </button>
                  )}
                </>
              ) : (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Add your contact info (optional):</p>
                  
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="whatsapp-name" className="text-xs">Name</Label>
                      <Input
                        id="whatsapp-name"
                        type="text"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        className="h-8 text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="whatsapp-email" className="text-xs">Email</Label>
                      <Input
                        id="whatsapp-email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        className="h-8 text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="whatsapp-phone" className="text-xs">Phone</Label>
                      <Input
                        id="whatsapp-phone"
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+44 7123 456 789"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCustomMessage}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      disabled={isSubmitting || !customMessage.trim()}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowUserForm(false);
                        setUserInfo({ name: '', email: '', phone: '' });
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Call Option */}
            <div className="pt-2 border-t">
              <Button
                onClick={() => window.open(`tel:${phoneNumber}`, '_self')}
                variant="outline"
                className="w-full justify-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <Phone className="w-4 h-4" />
                Call Us Directly
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
        size="lg"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>

      {/* Notification Badge - Only show when there are actual notifications */}
      {!isOpen && showOnExitIntent && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          1
        </div>
      )}
    </div>
  );
}