import React, { useState, useRef, useEffect } from 'react';
import { 
  FaBars, 
  FaUser,
  FaChevronDown,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { 
  LogOut, 
  User,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrainerHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  const trainerData = JSON.parse(localStorage.getItem("trainerUser"));
  const trainerName = trainerData?.name || trainerData?.trainer_name || "Trainer";
  const trainerEmail = trainerData?.email || "trainer@example.com";

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("trainerUser");
    localStorage.removeItem("trainerToken");
    sessionStorage.clear();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white shadow-xl border-b border-blue-400/20 fixed top-0 md:left-64 left-0 right-0 z-10 h-16">
      {/* ✅ FIXED: Removed md:ml-64 and adjusted positioning */}
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-700/80"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

      {/* ✅ FIXED: Proper container with sidebar offset */}
      <div className="relative flex items-center justify-between h-full px-4 lg:px-6 md:ml-64">
        
        {/* Left Section - Mobile Menu Only */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-blue-700/50 transition-all duration-200 active:scale-95"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <FaBars className="text-xl" />
          </button>

          {/* Desktop Logo - Simple */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Trainer Dashboard</span>
          </div>
        </div>

        {/* ✅ FIXED: Right Section with proper spacing and visibility */}
        <div className="flex items-center space-x-3 relative">
          
          {/* Trainer Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-700/50 transition-all duration-200 active:scale-95"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/20">
                <FaUser className="w-3 h-3" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium leading-none">{trainerName}</p>
                <p className="text-xs text-blue-100 leading-none">Trainer</p>
              </div>
              <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* ✅ FIXED: Dropdown positioning and visibility */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[60] transform transition-all duration-200 origin-top-right">
                {/* Dropdown Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{trainerName}</p>
                      <p className="text-xs text-gray-500 truncate">{trainerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Simplified Menu Items */}
                <div className="py-2">
                  {/* Profile Settings */}
                  <button 
                    onClick={() => {
                      navigate('/trainer/profile');
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-400" />
                    Profile Settings
                  </button>
                  
                  {/* Dark/Light Mode Toggle */}
                  <button 
                    onClick={toggleDarkMode}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {darkMode ? (
                      <FaSun className="w-4 h-4 mr-3 text-yellow-500" />
                    ) : (
                      <FaMoon className="w-4 h-4 mr-3 text-gray-400" />
                    )}
                    <div className="text-left">
                      <p className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</p>
                      <p className="text-xs text-gray-500">Switch theme</p>
                    </div>
                  </button>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-100 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-red-500 group-hover:text-red-600" />
                    <div className="text-left">
                      <p className="font-medium">Logout</p>
                      <p className="text-xs text-red-400">Sign out of trainer portal</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Border Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>
    </header>
  );
};

export default TrainerHeader;
