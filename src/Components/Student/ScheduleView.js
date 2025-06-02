import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaVideo, FaChalkboardTeacher } from 'react-icons/fa';

const ScheduleView = () => {
  const [activeTab, setActiveTab] = useState('week');
  
  const scheduleData = {
    week: [
      { 
        id: 1, 
        title: "React Fundamentals", 
        instructor: "Sarah Williams", 
        date: "2023-11-20", 
        day: "Monday", 
        time: "10:00 AM - 12:00 PM", 
        type: "Live Session", 
        zoomLink: "https://zoom.us/j/1234567890?pwd=abc123" 
      },
      { 
        id: 2, 
        title: "Advanced JavaScript", 
        instructor: "Michael Chen", 
        date: "2023-11-21", 
        day: "Tuesday", 
        time: "2:00 PM - 4:00 PM", 
        type: "Live Session", 
        zoomLink: "https://zoom.us/j/0987654321?pwd=xyz789" 
      },
      { 
        id: 3, 
        title: "Node.js Backend Development", 
        instructor: "David Rodriguez", 
        date: "2023-11-24", 
        day: "Friday", 
        time: "1:00 PM - 3:00 PM", 
        type: "Live Session", 
        zoomLink: "https://zoom.us/j/5432167890?pwd=def456" 
      }
    ],
    month: [
      // More data for month view
    ],
    upcoming: [
      // Upcoming assignments and events
    ]
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Class Schedule</h1>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button 
              onClick={() => setActiveTab('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'week' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              This Week
            </button>
            <button 
              onClick={() => setActiveTab('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'month' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              This Month
            </button>
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'upcoming' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {scheduleData[activeTab].length > 0 ? (
            scheduleData[activeTab].map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                        {session.day}
                      </div>
                      <span className="text-gray-600">{session.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{session.title}</h3>
                    <div className="flex items-center mt-1 text-gray-600">
                      <FaChalkboardTeacher className="mr-2" />
                      <span>{session.instructor}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end">
                    <div className="flex items-center mb-2">
                      <FaClock className="text-indigo-600 mr-2" />
                      <span className="font-medium">{session.time}</span>
                    </div>
                    <div className="flex items-center">
                      <FaVideo className="text-indigo-600 mr-2" />
                      <a 
                        href={session.zoomLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        Join Session
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
                      {session.type}
                    </div>
                    <button className="text-sm text-gray-600 hover:text-indigo-600">
                      Add to Calendar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 inline-block">
                <FaCalendarAlt className="text-gray-400 text-3xl" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No scheduled classes</h3>
              <p className="mt-1 text-gray-500">
                {activeTab === 'week' 
                  ? "You don't have any classes scheduled this week." 
                  : activeTab === 'month'
                    ? "You don't have any classes scheduled this month."
                    : "You don't have any upcoming classes or assignments."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;