'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock, Car, Phone, MessageCircle, ThumbsUp } from 'lucide-react';

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  location: string;
  experience: number;
  specialties: string[];
  transmissionTypes: ('manual' | 'automatic')[];
  pricePerHour: number;
  availability: string;
  bio: string;
  languages: string[];
  nationality: string;
  religion: string;
  ethnicity: string;
  gender: 'Male' | 'Female' | 'Non-binary';
}

interface InstructorCardProps {
  instructor: Instructor;
  onViewProfile: (instructor: Instructor) => void;
  onContact: (instructor: Instructor, method: 'phone' | 'whatsapp') => void;
  onWriteReview?: (instructor: Instructor) => void;
}

export default function InstructorCard({ instructor, onViewProfile, onContact, onWriteReview }: InstructorCardProps) {
  const initials = instructor.name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 group-hover:scale-105 transition-transform duration-300">
            <AvatarImage src={instructor.avatar} alt={instructor.name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">
              {instructor.name}
            </h3>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{instructor.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({instructor.reviews} reviews)
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{instructor.location}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Experience and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{instructor.experience} years experience</span>
          </div>
          <div className="font-bold text-lg text-primary">
            £{instructor.pricePerHour}/hr
          </div>
        </div>

        {/* Transmission Types */}
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-2">
            {instructor.transmissionTypes.map((type) => (
              <span
                key={type}
                className="px-2 py-1 bg-gray-100 text-xs rounded-full font-medium capitalize"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Specialties:</h4>
          <div className="flex flex-wrap gap-1">
            {instructor.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
            {instructor.specialties.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                +{instructor.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Bio Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {instructor.bio}
        </p>

        {/* Availability */}
        <div className="text-sm">
          <span className="font-medium">Available: </span>
          <span className="text-green-600">{instructor.availability}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onViewProfile(instructor)}
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onContact(instructor, 'phone')}
            className="px-3"
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => onContact(instructor, 'whatsapp')}
            className="px-3 bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          {onWriteReview && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onWriteReview(instructor)}
              className="px-3"
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}