import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaShieldAlt, FaBell, FaUser, FaSearch } from 'react-icons/fa';
import { 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  Crown,
  Sparkles,
  User,
  HelpCircle
} from 'lucide-react';

const AdminHeader = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Handle logout
  const handleLogout = () => {
    // Clear any admin authentication data
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    sessionStorage.clear();
    
    // Redirect to supremehandling
    window.location.href = '/supremehandling';
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 text-white shadow-xl border-b border-emerald-400/20 fixed top-0 md:left-64 left-0 right-0 h-16 z-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-green-600/80"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative flex items-center justify-between h-full px-4 lg:px-6">
        
        {/* Left Section - Mobile Menu & Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-emerald-700/50 transition-all duration-200 active:scale-95"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <FaBars className="text-xl" />
          </button>
          
          {/* Logo/Brand - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">NeoRAG</h1>
              <p className="text-xs text-emerald-100 leading-none">Admin Panel</p>
            </div> */}
          </div>
        </div>

        {/* Center Section - Main Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 p-1.5 rounded-lg backdrop-blur-sm border border-white/10">
            <Crown className="w-5 h-5 text-yellow-300" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            NeoRAG Admin
          </h1>
          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          
         
          
          {/* Admin Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-emerald-700/50 transition-all duration-200 active:scale-95"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/20">
                <FaUser className="w-3 h-3" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs text-emerald-100 leading-none">Administrator</p>
              </div>
              <ChevronDown className={`w-3 h-3 hidden lg:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 transform transition-all duration-200 origin-top-right">
                {/* Dropdown Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500">administrator@neorag.com</p>
                    </div>
                  </div>
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
                      <p className="text-xs text-red-400">Sign out of admin panel</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Border Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent"></div>
    </div>
  );
};

export default AdminHeader;
