// src/components/Trainer/TrainerHome.js
import React from 'react';
import { FaChalkboardTeacher, FaUsers, FaBook, FaVideo, FaChartBar } from 'react-icons/fa';

const TrainerHome = () => {
  const stats = [
    { id: 1, name: 'Active Courses', value: 5, icon: FaBook, change: '+2', changeType: 'positive' },
    { id: 2, name: 'Students Enrolled', value: 128, icon: FaUsers, change: '+24', changeType: 'positive' },
    { id: 3, name: 'Training Materials', value: 42, icon: FaChalkboardTeacher, change: '+8', changeType: 'positive' },
    { id: 4, name: 'Videos Uploaded', value: 18, icon: FaVideo, change: '+3', changeType: 'positive' },
  ];

  const recentActivities = [
    { id: 1, action: 'Uploaded new material', course: 'React Fundamentals', time: '2 hours ago' },
    { id: 2, action: 'Added new video', course: 'JavaScript Advanced', time: '1 day ago' },
    { id: 3, action: 'Updated course syllabus', course: 'Node.js Backend', time: '2 days ago' },
    { id: 4, action: 'Responded to student query', course: 'React Fundamentals', time: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <stat.icon className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last week
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">View all</a>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                      <p className="text-sm text-gray-500 truncate">{activity.course}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm font-medium text-gray-900">React Workshop</p>
              <p className="text-xs text-gray-500">Tomorrow, 10:00 AM - 12:00 PM</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="text-sm font-medium text-gray-900">JavaScript Q&A</p>
              <p className="text-xs text-gray-500">June 15, 2:00 PM - 3:00 PM</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="text-sm font-medium text-gray-900">Node.js Training</p>
              <p className="text-xs text-gray-500">June 18, 9:00 AM - 11:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerHome;