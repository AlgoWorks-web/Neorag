import React from 'react';
import { FaBell, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';

const StudentHeader = ({ toggleSidebar }) => {
  return (
    <header className="fixed w-full bg-white shadow-md z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-gray-600 mr-4 focus:outline-none"
          >
            <FiMenu className="text-2xl" />
          </button>
          <h1 className="text-xl font-bold text-indigo-700">LearnHub Student Portal</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative text-gray-600 hover:text-indigo-700">
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">3</span>
          </button>
          
          <button className="relative text-gray-600 hover:text-indigo-700">
            <FaEnvelope className="text-xl" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">5</span>
          </button>
          
          <div className="flex items-center">
            <div className="mr-3 text-right hidden md:block">
              <p className="text-sm font-medium text-gray-800">Alex Johnson</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
            <button className="text-gray-600 hover:text-indigo-700">
              <FaUserCircle className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;