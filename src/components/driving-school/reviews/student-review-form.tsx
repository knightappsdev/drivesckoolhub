'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, CheckCircle, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Instructor {
  id: string;
  name: string;
  avatar?: string;
}

interface StudentReviewFormProps {
  onSubmitSuccess?: () => void;
}

interface ReviewFormData {
  instructorId: string;
  rating: number;
  comment: string;
  lessonDate?: string;
}

export default function StudentReviewForm({ onSubmitSuccess }: StudentReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    instructorId: '',
    rating: 0,
    comment: '',
    lessonDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});
  const [hoveredRating, setHoveredRating] = useState(0);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      // In a real application, this would fetch instructors the student has had lessons with
      const response = await fetch('/api/instructors');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data.instructors || []);
      }
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewFormData> = {};

    if (!formData.instructorId) {
      newErrors.instructorId = '1'; // Just to indicate error
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
    const response = await fetch('/api/reviews/student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instructorId: formData.instructorId,
        rating: formData.rating,
        comment: formData.comment.trim(),
        lessonDate: formData.lessonDate || null,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.error && typeof result.error === 'string') {
        setErrors(prev => ({
          ...prev,
          comment:
            result.error.includes('already reviewed')
              ? 'You have already reviewed this instructor.'
              : result.error.includes('Authentication required')
              ? 'Please log in to submit a review.'
              : `Failed to submit review: ${result.error}`,
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          comment: `Failed to submit review. Please try again.`,
        }));
      }
      return;
    }

    setIsSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  } catch (error: any) {
    console.error('Student review submission error:', error);
    setErrors(prev => ({
      ...prev,
      comment:
        error instanceof Error
          ? error.message.includes('already reviewed')
            ? 'You have already reviewed this instructor.'
            : error.message.includes('Authentication required')
            ? 'Please log in to submit a review.'
            : `Failed to submit review: ${error.message}`
          : 'Failed to submit review. Please try again.',
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
            Your review has been submitted successfully and will help other students choose the right instructor.
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                instructorId: '',
                rating: 0,
                comment: '',
                lessonDate: '',
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

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Rate Your Instructor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedInstructor = instructors.find(i => i.id === formData.instructorId);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Rate Your Instructor
        </CardTitle>
        <p className="text-gray-600">
          Share your experience to help other students and improve our service
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Instructor Selection */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Select Instructor
            </h3>
            
            <div className="space-y-2">
              <Label>Which instructor would you like to review? *</Label>
              {instructors.length > 0 ? (
                <div className="grid gap-2">
                  {instructors.slice(0, 8).map((instructor) => (
                    <div
                      key={instructor.id}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-colors",
                        formData.instructorId === instructor.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, instructorId: instructor.id }));
                        if (errors.instructorId) {
                          setErrors(prev => ({ ...prev, instructorId: undefined }));
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {instructor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{instructor.name}</p>
                          <p className="text-sm text-gray-600">Driving Instructor</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4 text-center">
                  No instructors found. Please contact support if you believe this is an error.
                </p>
              )}
              {errors.instructorId && (
                <p className="text-sm text-red-600">Please select an instructor to review</p>
              )}
            </div>
          </div>

          {/* Lesson Date (Optional) */}
          {selectedInstructor && (
            <div className="space-y-2">
              <Label htmlFor="lessonDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                When did you have lessons with {selectedInstructor.name}? (Optional)
              </Label>
              <input
                type="month"
                id="lessonDate"
                value={formData.lessonDate}
                onChange={(e) => setFormData(prev => ({ ...prev, lessonDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

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
                Tell us about your experience with this instructor
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
                placeholder="Share details about the teaching style, lesson quality, communication, and overall experience..."
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
                  {formData.comment.length}/1000
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
                <Star className="w-4 h-4" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}