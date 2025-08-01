import React, { useEffect, useState, useRef } from 'react';
import { FaUserCircle, FaUser, FaChevronDown } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { LogOut, GraduationCap, User } from 'lucide-react';
import axios from 'axios';

const StudentHeader = ({ toggleSidebar }) => {
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const studentUser = JSON.parse(localStorage.getItem('studentUser'));
    if (studentUser && studentUser.id) {
      axios
        .get(`https://hydersoft.com/api/student/${studentUser.id}`)
        .then(res => {
          setUsername(res.data.username);
        })
        .catch(err => {
          console.error('Failed to fetch student:', err);
        });
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('studentUser');
    localStorage.removeItem('studentToken');
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-700 text-white shadow-xl border-b border-indigo-400/20 fixed top-0 md:left-64 left-0 right-0 h-16 z-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-700/80"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

      {/* ✅ FIXED: Content container with proper sidebar offset */}
      <div className="relative flex items-center justify-between h-full px-4 lg:px-6 md:pl-64">
        
        {/* Left Section - Mobile Menu & Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-indigo-700/50 transition-all duration-200 active:scale-95"
            aria-label="Toggle menu"
          >
            <FiMenu className="text-xl" />
          </button>

          {/* Desktop Logo */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Student</h1>
              <p className="text-xs text-indigo-100 leading-none">Portal</p>
            </div>
          </div>
        </div>

        {/* Center Section - Main Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center ">
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
            LearnHub Student Portal
          </h1>
        </div>

        {/* Right Section - Profile Only */}
        <div className="flex items-center space-x-3">
          
          {/* Student Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-indigo-700/50 transition-all duration-200 active:scale-95"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/20">
                <FaUser className="w-3 h-3" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium leading-none">
                  {username ? username : 'Loading...'}
                </p>
                <p className="text-xs text-indigo-100 leading-none">Student</p>
              </div>
              <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[60] transform transition-all duration-200 origin-top-right">
                {/* Dropdown Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {username ? username : 'Student'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">Student Account</p>
                    </div>
                  </div>
                </div>

                {/* Logout Section */}
                <div className="py-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-red-500 group-hover:text-red-600" />
                    <div className="text-left">
                      <p className="font-medium">Logout</p>
                      <p className="text-xs text-red-400">Sign out of student portal</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Border Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent"></div>
    </header>
  );
};

export default StudentHeader;
