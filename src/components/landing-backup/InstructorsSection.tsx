'use client';

import { motion } from 'framer-motion';
import { PhoneIcon } from '@heroicons/react/24/outline';

const instructors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    initials: 'SJ',
    experience: '8 years experience',
    specialties: ['Manual Transmission', 'Nervous Drivers', 'Test Preparation'],
    bio: 'Specializing in helping nervous drivers build confidence. Known for her patient approach and excellent test preparation techniques.',
    rating: 4.9,
    studentsCount: 320,
    passRate: 96,
    phone: '+447756183484'
  },
  {
    id: 2,
    name: 'Michael Chen',
    initials: 'MC',
    experience: '12 years experience',
    specialties: ['Automatic Transmission', 'Intensive Courses', 'Motorway Driving'],
    bio: 'Expert in intensive crash courses and advanced driving techniques. Helps students pass quickly with comprehensive training.',
    rating: 4.8,
    studentsCount: 450,
    passRate: 94,
    phone: '+447756183484'
  },
  {
    id: 3,
    name: 'Emma Williams',
    initials: 'EW',
    experience: '6 years experience',
    specialties: ['Beginner Friendly', 'Parallel Parking', 'City Driving'],
    bio: 'Patient and encouraging instructor perfect for absolute beginners. Makes learning to drive enjoyable and stress-free.',
    rating: 4.9,
    studentsCount: 280,
    passRate: 97,
    phone: '+447756183484'
  },
  {
    id: 4,
    name: 'David Thompson',
    initials: 'DT',
    experience: '15 years experience',
    specialties: ['ADI Training', 'Refresher Courses', 'Senior Drivers'],
    bio: 'Veteran instructor with extensive experience. Specializes in refresher courses and training for mature students.',
    rating: 4.8,
    studentsCount: 520,
    passRate: 93,
    phone: '+447756183484'
  },
  {
    id: 5,
    name: 'Lisa Rodriguez',
    initials: 'LR',
    experience: '9 years experience',
    specialties: ['Female Students', 'Anxiety Management', 'Pass Plus'],
    bio: 'Compassionate instructor who understands the unique challenges faced by anxious learners. Creates a supportive learning environment.',
    rating: 4.9,
    studentsCount: 380,
    passRate: 95,
    phone: '+447756183484'
  },
  {
    id: 6,
    name: 'James Wilson',
    initials: 'JW',
    experience: '11 years experience',
    specialties: ['Young Drivers', 'Sport Driving', 'Test Routes'],
    bio: 'Energetic instructor who connects well with young learners. Expert knowledge of local test routes and requirements.',
    rating: 4.7,
    studentsCount: 410,
    passRate: 92,
    phone: '+447756183484'
  }
];

export default function InstructorsSection() {
  const callInstructor = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const whatsappInstructor = (phone: string, name: string) => {
    const message = `Hi ${name}! I'd like to book driving lessons with you.`;
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="instructors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Instructor
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            All our instructors are DVSA approved with years of experience helping students pass their driving tests
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor) => (
            <motion.div
              key={instructor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: instructor.id * 0.1 }}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              {/* Instructor Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {instructor.initials}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{instructor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{instructor.experience}</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span>★ {instructor.rating}</span>
                  <span>•</span>
                  <span>{instructor.studentsCount}+ students</span>
                  <span>•</span>
                  <span>{instructor.passRate}% pass rate</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                {instructor.bio}
              </p>

              {/* Specialties */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                  {instructor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  View Profile
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => callInstructor(instructor.phone)}
                    className="flex-1 flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    title="Call"
                  >
                    <PhoneIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => whatsappInstructor(instructor.phone, instructor.name)}
                    className="flex-1 flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    title="WhatsApp"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}