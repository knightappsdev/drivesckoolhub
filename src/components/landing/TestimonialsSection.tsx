'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Emily Parker',
    course: 'Complete Beginner Course',
    text: 'Sarah was incredibly patient with me as a nervous first-time driver. Her teaching methods helped me pass on my first attempt!',
    rating: 5,
    passedIn: '6 weeks'
  },
  {
    id: 2,
    name: 'James Mitchell',
    course: 'Intensive Crash Course',
    text: 'Michael\'s intensive course was exactly what I needed. Structured, efficient, and I passed within 3 weeks of starting.',
    rating: 5,
    passedIn: '3 weeks'
  },
  {
    id: 3,
    name: 'Sophie Chen',
    course: 'Refresher Course',
    text: 'After 10 years without driving, Emma helped me regain my confidence quickly. Professional and understanding throughout.',
    rating: 5,
    passedIn: '2 weeks'
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600">
            Hear from thousands of successful drivers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: testimonial.id * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
              
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.course}</p>
                <p className="text-sm text-blue-600 font-medium">Passed in {testimonial.passedIn}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}