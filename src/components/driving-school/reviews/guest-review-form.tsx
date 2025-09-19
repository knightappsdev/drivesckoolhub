'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, User, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuestReviewFormProps {
  instructorId?: string;
  instructorName?: string;
  onSubmitSuccess?: () => void;
}

interface ReviewFormData {
  reviewerName: string;
  reviewerEmail: string;
  instructorName: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
}

export default function GuestReviewForm({ 
  instructorId, 
  instructorName = '', 
  onSubmitSuccess 
}: GuestReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    reviewerName: '',
    reviewerEmail: '',
    instructorName: instructorName,
    rating: 0,
    comment: '',
    isAnonymous: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});
  const [hoveredRating, setHoveredRating] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewFormData> = {};

    if (!formData.reviewerName.trim()) {
      newErrors.reviewerName = 'Name is required';
    }

    if (!formData.reviewerEmail.trim()) {
      newErrors.reviewerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reviewerEmail)) {
      newErrors.reviewerEmail = 'Please enter a valid email address';
    }

    if (!formData.instructorName.trim()) {
      newErrors.instructorName = 'Instructor name is required';
    }

    if (formData.rating === 0) {
      newErrors.rating = 1; // Just to indicate error
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Please share your experience';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Please provide a more detailed review (minimum 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await fetch('/api/reviews/guest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reviewerName: formData.reviewerName.trim(),
        reviewerEmail: formData.reviewerEmail.trim(),
        instructorName: formData.instructorName.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
        isAnonymous: formData.isAnonymous,
        instructorId: instructorId || null,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    setIsSubmitted(true);

    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  } catch (error) {
    console.error('Review submission error:', error);
    setErrors(prev => ({
      ...prev,
      comment: `Failed to submit review: ${error instanceof Error ? error.message : 'Unknown error'}`
    }));
  } finally {
    setIsSubmitting(false);
  }
};

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
          <p className="text-gray-600">
            Your review has been submitted successfully. It will be published after moderation.
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                reviewerName: '',
                reviewerEmail: '',
                instructorName: '',
                rating: 0,
                comment: '',
                isAnonymous: false,
              });
              setErrors({});
            }}
          >
            Submit Another Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Share Your Experience
        </CardTitle>
        <p className="text-gray-600">
          Help others by sharing your experience with our driving instructors
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reviewerName">
                  Your Name *
                </Label>
                <Input
                  id="reviewerName"
                  value={formData.reviewerName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, reviewerName: e.target.value }));
                    if (errors.reviewerName) {
                      setErrors(prev => ({ ...prev, reviewerName: undefined }));
                    }
                  }}
                  placeholder="Enter your full name"
                  className={cn(errors.reviewerName && "border-red-500")}
                />
                {errors.reviewerName && (
                  <p className="text-sm text-red-600">{errors.reviewerName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewerEmail">
                  Your Email *
                </Label>
                <Input
                  id="reviewerEmail"
                  type="email"
                  value={formData.reviewerEmail}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, reviewerEmail: e.target.value }));
                    if (errors.reviewerEmail) {
                      setErrors(prev => ({ ...prev, reviewerEmail: undefined }));
                    }
                  }}
                  placeholder="your@email.com"
                  className={cn(errors.reviewerEmail && "border-red-500")}
                />
                {errors.reviewerEmail && (
                  <p className="text-sm text-red-600">{errors.reviewerEmail}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isAnonymous" className="text-sm">
                Post this review anonymously (your name won't be displayed)
              </Label>
            </div>
          </div>

          {/* Instructor Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Instructor Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="instructorName">
                Instructor Name *
              </Label>
              <Input
                id="instructorName"
                value={formData.instructorName}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, instructorName: e.target.value }));
                  if (errors.instructorName) {
                    setErrors(prev => ({ ...prev, instructorName: undefined }));
                  }
                }}
                placeholder="Enter instructor's name"
                className={cn(errors.instructorName && "border-red-500")}
              />
              {errors.instructorName && (
                <p className="text-sm text-red-600">{errors.instructorName}</p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <h3 className="font-medium">Your Rating *</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={cn(
                      "p-1 transition-colors",
                      "hover:scale-110 transform transition-transform"
                    )}
                  >
                    <Star
                      className={cn(
                        "w-8 h-8 transition-colors",
                        (hoveredRating || formData.rating) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  </button>
                ))}
              </div>
              
              {formData.rating > 0 && (
                <Badge variant="outline" className="text-sm">
                  {formData.rating === 1 && "Poor"}
                  {formData.rating === 2 && "Fair"}
                  {formData.rating === 3 && "Good"}
                  {formData.rating === 4 && "Very Good"}
                  {formData.rating === 5 && "Excellent"}
                </Badge>
              )}
              
              {errors.rating && (
                <p className="text-sm text-red-600">Please select a rating</p>
              )}
            </div>
          </div>

          {/* Review Comment */}
          <div className="space-y-4">
            <h3 className="font-medium">Your Experience *</h3>
            
            <div className="space-y-2">
              <Label htmlFor="comment">
                Share your experience with this instructor
              </Label>
              <textarea
                id="comment"
                rows={4}
                value={formData.comment}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, comment: e.target.value }));
                  if (errors.comment) {
                    setErrors(prev => ({ ...prev, comment: undefined }));
                  }
                }}
                placeholder="Tell us about your lessons, the instructor's teaching style, and your overall experience..."
                className={cn(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
                  errors.comment && "border-red-500"
                )}
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Minimum 10 characters
                </div>
                <div className="text-xs text-gray-500">
                  {formData.comment.length}/500
                </div>
              </div>
              {errors.comment && (
                <p className="text-sm text-red-600">{errors.comment}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}