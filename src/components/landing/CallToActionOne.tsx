'use client';

export default function CallToActionOne() {
  const scrollToCourses = () => {
    const element = document.querySelector('#courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/447756183484', '_blank');
  };

  return (
    <section className="w-full bg-gradient-to-r from-blue-600 to-green-600 py-16">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Driving Journey?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Our expert instructors will guide you through every step. Get personalized 
          support and increase your chances of passing first time!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={scrollToCourses}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Book Your First Lesson
          </button>
          <button
            onClick={openWhatsApp}
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
          >
            Get Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
}