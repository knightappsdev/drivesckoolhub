// Utility functions for form submissions

export interface FormSubmissionOptions {
  type: 'instructor-registration' | 'exit-intent' | 'whatsapp-contact' | 'general-inquiry';
  data: Record<string, any>;
  customerEmail?: string;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  formSubmissionSent: boolean;
  autoResponseSent: boolean;
  error?: string;
}

/**
 * Submit form data to the email API
 */
export async function submitFormData(options: FormSubmissionOptions): Promise<FormSubmissionResult> {
  try {
    const response = await fetch('/api/email/send-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: options.type,
        data: options.data,
        customerEmail: options.customerEmail,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        message: result.message || 'Form submitted successfully',
        formSubmissionSent: result.formSubmissionSent || false,
        autoResponseSent: result.autoResponseSent || false,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to submit form',
        formSubmissionSent: false,
        autoResponseSent: false,
        error: result.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred while submitting form',
      formSubmissionSent: false,
      autoResponseSent: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format WhatsApp message data for email submission
 */
export function formatWhatsAppData(messageData: {
  message: string;
  type: 'quick' | 'custom';
  quickMessageLabel?: string;
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}) {
  return {
    message: messageData.message,
    messageType: messageData.type,
    quickMessageLabel: messageData.quickMessageLabel || null,
    userName: messageData.userInfo?.name || null,
    userEmail: messageData.userInfo?.email || null,
    userPhone: messageData.userInfo?.phone || null,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic UK format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Basic validation for UK phone numbers
  const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}