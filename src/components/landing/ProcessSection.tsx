'use client';

import { motion } from 'framer-motion';
import { 
  DocumentTextIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

export default function ProcessSection() {
  const steps = [
    {
      id: 1,
      title: "Apply for a DVLA Provisional License",
      description: "Get your provisional license to legally start learning to drive in the UK. Must be at least 17 years old.",
      icon: DocumentTextIcon,
      link: "https://www.gov.uk/apply-first-provisional-driving-licence",
      linkText: "Apply Online",
      color: "from-blue-500 to-blue-600",
      duration: "1-2 weeks"
    },
    {
      id: 2,
      title: "Start Your Theory Lessons",
      description: "Learn the Highway Code, road signs, and traffic rules through our interactive theory courses.",
      icon: BookOpenIcon,
      link: "#courses",
      linkText: "Book Theory Course",
      color: "from-green-500 to-green-600",
      duration: "2-4 weeks"
    },
    {
      id: 3,
      title: "Prepare & Pass Your Theory Test",
      description: "Take your official DVLA theory test including multiple choice and hazard perception.",
      icon: AcademicCapIcon,
      link: "https://www.gov.uk/book-theory-test",
      linkText: "Book Theory Test",
      color: "from-purple-500 to-purple-600",
      duration: "Test day"
    },
    {
      id: 4,
      title: "Book For Your Practical Lessons",
      description: "Choose your perfect course package from our range of practical driving lessons.",
      icon: CalendarDaysIcon,
      link: "#courses",
      linkText: "Book Practical Course",
      color: "from-orange-500 to-orange-600",
      duration: "Same day"
    },
    {
      id: 5,
      title: "Start Your Practical Classes",
      description: "Begin hands-on driving lessons with our expert DVSA approved instructors.",
      icon: UserGroupIcon,
      link: "#instructors",
      linkText: "Meet Our Instructors",
      color: "from-red-500 to-red-600",
      duration: "4-12 weeks"
    },
    {
      id: 6,
      title: "Prepare & Pass Your Practical Test",
      description: "Take your driving test with confidence and get your full UK driving license!",
      icon: TrophyIcon,
      link: "/contact",
      linkText: "Contact Us",
      color: "from-yellow-500 to-yellow-600",
      duration: "Test day"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="process" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            UK Driver's License Process
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Simplified
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow our step-by-step guide to get your full UK driving license. 
            We&apos;ll support you through every stage of your learning journey.
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                variants={cardVariants}
                className="relative group"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 z-10">
                    <motion.div
                      className="w-8 h-1 bg-gradient-to-r from-gray-300 to-gray-400"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      viewport={{ once: true }}
                    />
                    <motion.div
                      className="absolute -right-1 -top-1 w-3 h-3 bg-gray-400 rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
                      viewport={{ once: true }}
                    />
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full border border-gray-100 group-hover:border-gray-200">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {step.id}
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                      {step.duration}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Action Button */}
                  <motion.a
                    href={step.link}
                    className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${step.color} text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group/btn`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    target={step.link.startsWith('http') ? '_blank' : '_self'}
                    rel={step.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    {step.linkText}
                    {step.link.startsWith('http') ? (
                      <ArrowTopRightOnSquareIcon className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    ) : (
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    )}
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Process Timeline Mobile */}
        <div className="block lg:hidden mt-12">
          <div className="flex flex-col items-center">
            {steps.map((step, index) => (
              <div key={`mobile-${step.id}`} className="flex items-center">
                {index > 0 && (
                  <motion.div
                    className="w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-400 mb-4"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Need Help With Any Step?
            </h3>
            <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
              Our expert team is here to guide you through every stage of the process. 
              From theory to practical, we&apos;ll make sure you&apos;re ready for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="tel:+447756183484"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📞 Call Us: +44 7756 183484
              </motion.a>
              <motion.a
                href="https://wa.me/447756183484"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💬 WhatsApp Support
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}