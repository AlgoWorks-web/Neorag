import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ Image imports
import webDev from "../Assets/webdev.jpg";
import dataScience from "../Assets/datascience.jpg";
import uxDesign from "../Assets/uxdesign.jpg";
import ai from "../Assets/ai.jpg";
import business from "../Assets/business.jpg";
import marketing from "../Assets/marketing.jpg";

const Services = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      description: "Master HTML, CSS, JavaScript, React, Node.js and build real-world projects",
      image: webDev,
      duration: "6 months",
      level: "Beginner to Advanced",
    },
    {
      id: 2,
      title: "Data Science & Machine Learning",
      description: "Learn Python, data analysis, visualization, and machine learning algorithms",
      image: dataScience,
      duration: "8 months",
      level: "Intermediate",
    },
    {
      id: 3,
      title: "UX/UI Design",
      description: "Master user research, wireframing, prototyping, and design systems",
      image: uxDesign,
      duration: "4 months",
      level: "Beginner",
    },
    {
      id: 4,
      title: "AI Engineering",
      description: "Deep dive into neural networks, NLP, computer vision and AI deployment",
      image: ai,
      duration: "9 months",
      level: "Advanced",
    },
    {
      id: 5,
      title: "Business Analytics",
      description: "Learn SQL, Tableau, Excel, and data-driven decision making",
      image: business,
      duration: "5 months",
      level: "Beginner",
    },
    {
      id: 6,
      title: "Digital Marketing",
      description: "Master SEO, SEM, social media marketing, and analytics",
      image: marketing,
      duration: "3 months",
      level: "Beginner",
    },
  ];

  // ✅ Check if student is logged in
  const isLoggedIn = () => {
    const studentData = localStorage.getItem("studentUser");
    return studentData !== null;
  };

  // ✅ Handle View Course click
  const handleViewDetails = (courseId) => {
    if (isLoggedIn()) {
      navigate(`/course/${courseId}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore Our Courses</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Industry-relevant programs designed to get you hired in today's most in-demand fields
          </p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{course.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between text-sm text-gray-500 mb-6">
                  <span>⏱️ {course.duration}</span>
                  <span>📊 {course.level}</span>
                </div>
                <button
                  onClick={() => handleViewDetails(course.id)}
                  className="block w-full text-center py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                  View Course Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Not Sure Which Course Is Right For You?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Take our 2-minute career quiz to discover the perfect program for your goals
          </p>
          <button
            onClick={() => navigate("/career-quiz")}
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg"
          >
            Take Career Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;