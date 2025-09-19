'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Plus, Star } from 'lucide-react';
import ReviewsDisplay from './reviews-display';
import GuestReviewForm from './guest-review-form';

interface RatingSystemProps {
  instructorId?: string;
  instructorName?: string;
  courseId?: string;
  courseName?: string;
  type?: 'instructor' | 'course' | 'general';
  showAddReview?: boolean;
  className?: string;
}

export default function RatingSystem({
  instructorId,
  instructorName,
  courseId,
  courseName,
  type = 'instructor',
  showAddReview = true,
  className
}: RatingSystemProps) {
  const [activeTab, setActiveTab] = useState('reviews');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSubmitSuccess = () => {
    setShowReviewForm(false);
    setActiveTab('reviews');
    // Refresh reviews display by triggering a re-render
    window.location.reload(); // In a production app, you'd use a more elegant state management approach
  };

  if (showReviewForm) {
    return (
      <div className={className}>
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowReviewForm(false)}
            className="mb-4"
          >
            ← Back to Reviews
          </Button>
        </div>
        <GuestReviewForm
          instructorId={instructorId}
          instructorName={instructorName}
          onSubmitSuccess={handleReviewSubmitSuccess}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Reviews & Ratings
            </TabsTrigger>
          </TabsList>
          
          {showAddReview && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-2 ml-4"
            >
              <Plus className="w-4 h-4" />
              Write Review
            </Button>
          )}
        </div>

        <TabsContent value="reviews" className="mt-0">
          <ReviewsDisplay
            instructorId={instructorId}
            showInstructorName={!instructorId} // Show instructor name if not specific to one instructor
            maxDisplayed={5}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}