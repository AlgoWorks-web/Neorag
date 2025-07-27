// src/components/Trainer/TrainerHome.js
import React from 'react';
import { FaChalkboardTeacher, FaUsers, FaBook, FaVideo, FaChartBar } from 'react-icons/fa';

const TrainerHome = () => {
  const stats = [
    { id: 1, name: 'Active Courses', value: 0, icon: FaBook,  },
    { id: 2, name: 'Students Enrolled', value: 0, icon: FaUsers,  },
    { id: 3, name: 'Training Materials', value: 0, icon: FaChalkboardTeacher,  },
    { id: 4, name: 'Videos Uploaded', value: 0, icon: FaVideo,  },
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
                {stat.change} 
              </p>
            </div>
          </div>
        ))}
      </div>
     <div>
      Under development..! Visit Later 
     </div>

    </div>
  );
};

export default TrainerHome;