import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaBook, FaVideo, FaChartLine, FaFileAlt } from 'react-icons/fa';
import Courses from './Courses';

const StudentHome = () => {
  const today = new Date();
  const upcomingClasses = [
    { id: 1, title: "React Fundamentals", time: "10:00 AM - 12:00 PM", date: "Today" },
    { id: 2, title: "Advanced JavaScript", time: "2:00 PM - 4:00 PM", date: "Tomorrow" }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <FaBook className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Courses</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <FaVideo className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Videos Watched</p>
              <p className="text-2xl font-bold">0/0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FaCalendarAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Upcoming Classes</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <FaChartLine className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Overall Progress</p>
              <p className="text-2xl font-bold">0%</p>
            </div>
          </div>
        </div>
      </div>

       <Courses/>
    </div>
  );
};

export default StudentHome;