import React from "react";
import { Link } from "react-router-dom";
import Tooltip from "./Tooltip";


// Using higher quality placeholder images with education theme
const heroImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw4p8Bxx_Y3p8Dc95P5eznTddU9lytNbB2FQ&s";
const icon1 = "https://cdn-icons-png.flaticon.com/512/3132/3132693.png";
const icon2 = "https://cdn-icons-png.flaticon.com/512/3176/3176272.png";
const icon3 = "https://cdn-icons-png.flaticon.com/512/3573/3573565.png";
const student1 = "https://randomuser.me/api/portraits/women/44.jpg";
const student2 = "https://randomuser.me/api/portraits/men/32.jpg";
const student3 = "https://randomuser.me/api/portraits/women/68.jpg";

const HomePage = () => {

   
  const stats = [
    { value: "95%", label: "Completion Rate" },
    { value: "10k+", label: "Students Enrolled" },
    { value: "4.9/5", label: "Satisfaction Rating" },
  ];

  const features = [
    {
      icon: icon1,
      title: "Expert Mentorship",
      description: "Learn directly from industry professionals with real-world experience"
    },
    {
      icon: icon2,
      title: "Career Certificates",
      description: "Earn credentials that employers recognize and value"
    },
    {
      icon: icon3,
      title: "Vibrant Community",
      description: "Connect with peers and build your professional network"
    }
  ];

  const testimonials = [
    {
      image: student1,
      name: "Sarah Johnson",
      role: "Data Science Student",
      quote: "The courses transformed my career. I landed a job at Google within 3 months!"
    },
    {
      image: student2,
      name: "Michael Chen",
      role: "Web Development Student",
      quote: "The hands-on projects gave me the portfolio I needed to stand out to employers"
    },
    {
      image: student3,
      name: "Priya Patel",
      role: "UX Design Student",
      quote: "The mentorship program connected me with industry leaders I never thought I'd meet"
    }
  ];

  return (
    <div className="w-full overflow-hidden font-sans">
      <Tooltip />
      {/* Hero Section - Modern gradient */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-24 bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Transform Your Career with <span className="text-amber-300">Modern Skills</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
                Join our community of learners mastering the most sought-after skills with industry-leading courses and personalized mentorship.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link 
                  to="/signup" 
                  className="px-6 py-3 md:px-8 md:py-4 bg-white text-indigo-600 font-bold rounded-full text-center hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Learning Free
                </Link>
                <Link 
                  to="/services" 
                  className="px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-center hover:bg-white hover:text-indigo-600 transition-all"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-amber-400 to-amber-300 rounded-2xl transform rotate-2 z-0"></div>
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img 
                    src={heroImage} 
                    alt="Students learning" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Clean cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-sm text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-lg text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Modern cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Learners Choose Us
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive learning experience designed for career success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-2 border border-gray-100"
              >
                <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <img src={feature.icon} alt={feature.title} className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Modern layout */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-indigo-100">
              Hear from our students who transformed their careers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-white"
                  />
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-indigo-200 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-indigo-50">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Vibrant but clean */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg text-amber-100 mb-10 max-w-2xl mx-auto">
            Join our community and start your journey today
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-white text-amber-600 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg"
            >
              Get Started Free
            </Link>
            <Link 
              to="/pricing" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-amber-600 transition-all"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;