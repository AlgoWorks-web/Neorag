import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Changed from next/router
import StudentHeader from '../Components/Student/StudentHeader'; // Fixed import path
import StudentSidebar from '../Components/Student/StudentSidebar'; // Fixed import path
import LoadingSpinner from '../Components/Common/LoadingSpinner';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const isAuthenticated = localStorage.getItem('studentToken');
    
  //   if (!isAuthenticated) {
  //     navigate('/student');
      
  //   } else {
  //     setLoading(false);
  //   }
  // }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StudentHeader toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16">
        <StudentSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        <main className="flex-1 ml-0 md:ml-64 p-4 md:p-6 transition-all duration-300 bg-white md:bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;