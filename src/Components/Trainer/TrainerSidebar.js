// src/components/Trainer/TrainerSidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBook, FaUser, FaVideo, FaFileAlt, FaCog } from 'react-icons/fa';

const TrainerSidebar = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div 
      className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 z-30 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition duration-200 ease-in-out h-full`}
    >
      <div className="text-white flex items-center space-x-2 px-4">
        <span className="text-2xl font-extrabold">Trainer Portal</span>
      </div>
      
      <nav>
        <NavLink 
          to="/trainer" 
          end
          className={({isActive}) => 
            `flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/trainer/training-info" 
          className={({isActive}) => 
            `flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaBook />
          <span>Training Info</span>
        </NavLink>
        
        <NavLink 
          to="/trainer/materials" 
          className={({isActive}) => 
            `flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaFileAlt />
          <span>Materials</span>
        </NavLink>
        
        <NavLink 
          to="/trainer/videos" 
          className={({isActive}) => 
            `flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaVideo />
          <span>Videos</span>
        </NavLink>
        
        <NavLink 
          to="/trainer/profile" 
          className={({isActive}) => 
            `flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaUser />
          <span>Profile</span>
        </NavLink>
        
        <NavLink 
          to="/settings" 
          className={({isActive}) => 
            `flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default TrainerSidebar;