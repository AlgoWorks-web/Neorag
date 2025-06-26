import { FaComment, FaEye, FaShareAlt, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StatsCards = () => {
  const [statsData, setStatsData] = useState({
    messages: 0,
    views: 0,
    shares: 0,
    students: 0,
    trainers: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, trainersRes] = await Promise.all([
          axios.get('https://hydersoft.com/api/students'),
          axios.get('https://hydersoft.com/api/trainers')
        ]);

        setStatsData(prev => ({
          ...prev,
          students: studentsRes.data.success ? studentsRes.data.meta.total : 0,
          trainers: trainersRes.data.success ? trainersRes.data.meta.total : 0
        }));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleCardClick = (type) => {
    if (type === 'students') {
      navigate('/admin-home/adminstudents');
    } else if (type === 'trainers') {
      navigate('/admin-home/adminstrainers');
    }
  };

  const stats = [
    { 
      icon: <FaUsers className="text-3xl" />, 
      value: loading ? '...' : statsData.students, 
      label: "Students", 
      color: "bg-orange-500",
      clickable: true,
      type: 'students'
    },
    { 
      icon: <FaChalkboardTeacher className="text-3xl" />, 
      value: loading ? '...' : statsData.trainers, 
      label: "Trainers", 
      color: "bg-purple-500",
      clickable: true,
      type: 'trainers'
    },
    { 
      icon: <FaComment className="text-3xl" />, 
      value: statsData.messages, 
      label: "Messages", 
      color: "bg-red-500",
      clickable: false
    },
    { 
      icon: <FaEye className="text-3xl" />, 
      value: statsData.views, 
      label: "Views", 
      color: "bg-blue-500",
      clickable: false
    },
    { 
      icon: <FaShareAlt className="text-3xl" />, 
      value: statsData.shares, 
      label: "Shares", 
      color: "bg-teal-500",
      clickable: false
    }

  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`${stat.color} text-white p-4 rounded-lg shadow ${stat.clickable ? 'cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200' : ''}`}
          onClick={() => stat.clickable && handleCardClick(stat.type)}
        >
          <div className="flex justify-between items-center">
            {stat.icon}
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
          <h4 className="mt-2">{stat.label}</h4>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;