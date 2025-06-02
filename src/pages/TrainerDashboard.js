// src/pages/TrainerDashboard.js
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TrainerHeader from '../Components/Trainer/TrainerHeader';
import TrainerSidebar from '../Components/Trainer/TrainerSidebar';

const TrainerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Step 1: Add loading state
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('trainerToken');
    
    if (!isAuthenticated) {
      navigate('/trainer-login');
    } else {
      setLoading(false); // Step 2: Set loading to false after auth check
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Step 3: Add loader while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TrainerHeader toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16">
        <TrainerSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        <main className="flex-1 ml-0 md:ml-64 p-4 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrainerDashboard;