// src/pages/TrainerDashboard.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TrainerHeader from '../Components/Trainer/TrainerHeader';
import TrainerSidebar from '../Components/Trainer/TrainerSidebar';

const TrainerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
