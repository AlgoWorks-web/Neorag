import React from 'react';
import { FaCalendarAlt, FaClock, FaLink } from 'react-icons/fa';

const CourseOverview = ({ course }) => {
  if (!course) return null;
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Class Schedule</h2>
      
      <div className="space-y-4">
        {course.schedule.map((session, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center mb-2">
              <FaCalendarAlt className="text-indigo-600 mr-2" />
              <span className="font-medium">{session.day}</span>
            </div>
            <div className="flex items-center mb-2">
              <FaClock className="text-indigo-600 mr-2" />
              <span>{session.time}</span>
            </div>
            <div className="flex items-center">
              <FaLink className="text-indigo-600 mr-2" />
              <a 
                href={session.zoomLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Join Zoom Session
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Course Progress</h2>
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress: {course.progress}%</span>
            <span className="text-sm font-medium text-gray-700">{course.progress}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-indigo-600 h-4 rounded-full" 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Announcements</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-600 pl-4 py-2">
            <h3 className="font-medium text-gray-800">Project Submission Deadline Extended</h3>
            <p className="text-sm text-gray-600">Due to requests, the project submission deadline has been extended by 3 days.</p>
            <p className="text-xs text-gray-500 mt-1">Posted 2 days ago</p>
          </div>
          <div className="border-l-4 border-green-600 pl-4 py-2">
            <h3 className="font-medium text-gray-800">Guest Lecture Next Week</h3>
            <p className="text-sm text-gray-600">Industry expert John Smith will join us next Wednesday to discuss real-world applications.</p>
            <p className="text-xs text-gray-500 mt-1">Posted 5 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;