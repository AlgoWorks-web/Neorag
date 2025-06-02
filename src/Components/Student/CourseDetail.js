import React, { useState, useEffect } from 'react';
import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { studentCourses } from '../../data/studentCourses';

const CourseDetail = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // 🟢 Always run hooks before conditionals
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentTab = pathSegments[pathSegments.length - 1];
    if (currentTab === 'materials' || currentTab === 'videos') {
      setActiveTab(currentTab);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  const course = studentCourses.find(c => c.id === parseInt(courseId));

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
        <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or may have been removed.</p>
        <Link 
          to="/student/courses" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* ... Rest of your JSX remains unchanged ... */}
      <Outlet context={{ course }} />
    </div>
  );
};

export default CourseDetail;
