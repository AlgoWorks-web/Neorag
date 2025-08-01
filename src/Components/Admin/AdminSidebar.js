import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTimes, 
  FaUsers, 
  FaGem, 
  FaBell, 
  FaCog, 
  FaRegMehBlank,
  FaChevronRight,
  FaShieldAlt
} from 'react-icons/fa';
import { 
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  Calendar,
  MessageSquare,
  Phone,
  Home,
  Sparkles,
  BarChart3,
  Shield
} from 'lucide-react';

const AdminSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const menuItems = [
    {
      to: "/admin-home",
      icon: <Home className="w-5 h-5" />,
      label: "Overview",
      end: true
    },
    {
      to: "/admin-home/Adminstudents",
      icon: <Users className="w-5 h-5" />,
      label: "Students"
    },
    {
      to: "/admin-home/adminstrainers",
      icon: <GraduationCap className="w-5 h-5" />,
      label: "Trainers"
    },
    {
      to: "/admin-home/Admincourses",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Courses"
    },
    {
      to: "/admin-home/agreements",
      icon: <FileText className="w-5 h-5" />,
      label: "Agreements"
    },
    {
      to: "/admin-home/students-enrolled",
      icon: <Users className="w-5 h-5" />,
      label: "Enrolled Students"
    },
    {
      to: "/admin-home/contactinfo",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Contact Info"
    },
    {
      to: "/admin-home/appointmentinfo",
      icon: <Calendar className="w-5 h-5" />,
      label: "Appointments"
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`bg-gradient-to-b from-emerald-900 via-emerald-800 to-green-900 text-white w-64 fixed inset-y-0 left-0 z-40 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto`}
      >
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-green-900/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative px-6 py-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-2.5 rounded-xl shadow-lg">
                <FaShieldAlt className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-100 to-white bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-emerald-200 text-xs font-medium">System Management</p>
              </div>
            </div>
            
            {/* Decorative Line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent mt-4"></div>
          </div>
        </div>

        {/* Close Button for Mobile */}
        <div className="md:hidden px-3 pb-2">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-emerald-700/50 hover:bg-emerald-600/50 rounded-lg transition-colors text-emerald-100 hover:text-white"
          >
            <FaTimes className="w-4 h-4" />
            Close Menu
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="px-3 pb-6 space-y-2">
          {menuItems.map((item, index) => (
            <NavLink 
              key={index}
              to={item.to} 
              end={item.end}
              className={({isActive}) => 
                `group relative flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white hover:translate-x-1'
                }`
              }
              onClick={() => window.innerWidth < 768 && toggleSidebar()}
            >
              {/* Active Indicator */}
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emerald-300 rounded-r-full transition-all duration-200 ${
                ({isActive}) => isActive ? 'opacity-100' : 'opacity-0'
              }`} />
              
              {/* Icon */}
              <div className="relative">
                {item.icon}
                {/* Glow effect for active item */}
                <div className="absolute inset-0 rounded-full bg-emerald-300/20 scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              
              {/* Label */}
              <span className="font-medium tracking-wide">{item.label}</span>
              
              {/* Arrow for active item */}
              <FaChevronRight className="ml-auto w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </NavLink>
          ))}
        </nav>
        
        {/* System Stats */}
        {/* <div className="px-4 mb-6">
          <div className="bg-emerald-800/50 rounded-lg p-4 border border-emerald-600/30">
            <h3 className="text-emerald-100 text-sm font-medium mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              System Overview
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-300">Total Users</span>
                <span className="text-emerald-100 font-medium">0</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-300">Active Courses</span>
                <span className="text-emerald-100 font-medium">0</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-300">System Health</span>
                <span className="text-green-400 font-medium">●</span>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Admin Tools */}
        {/* <div className="px-4 mb-6">
          <div className="bg-emerald-800/50 rounded-lg p-4 border border-emerald-600/30">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-emerald-100 text-sm font-medium">Admin Tools</p>
                <p className="text-emerald-300 text-xs">System Settings</p>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Footer */}
        <div className="px-4 pt-4 border-t border-emerald-700/50">
          <div className="text-center">
            <div className="text-emerald-300 text-xs font-medium mb-1">
              &copy; {new Date().getFullYear()} LearnHub LMS
            </div>
            <div className="text-emerald-400 text-xs">
              Administrative Control
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-900/80 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default AdminSidebar;
