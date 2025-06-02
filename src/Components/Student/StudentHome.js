import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaBook, FaVideo, FaChartLine, FaFileAlt } from 'react-icons/fa';

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
              <p className="text-2xl font-bold">3</p>
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
              <p className="text-2xl font-bold">12/24</p>
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
              <p className="text-2xl font-bold">2</p>
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
              <p className="text-2xl font-bold">42%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Classes</h2>
            <Link to="/student/schedule" className="text-indigo-600 text-sm font-medium">View All</Link>
          </div>
          
          <div className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{classItem.title}</h3>
                    <p className="text-sm text-gray-600">{classItem.time}</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                    {classItem.date}
                  </span>
                </div>
                <button className="mt-3 text-indigo-600 text-sm font-medium hover:text-indigo-800">
                  Join Class
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Activities</h2>
            <button className="text-indigo-600 text-sm font-medium">See More</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <FaBook className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800">Completed <span className="font-medium">"Introduction to React"</span> video</p>
                <p className="text-xs text-gray-500">Yesterday at 4:32 PM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FaFileAlt className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800">Downloaded <span className="font-medium">"React Cheat Sheet.pdf"</span></p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <FaVideo className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800">Started watching <span className="font-medium">"Components and Props"</span></p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;