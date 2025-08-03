import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaFileAlt, 
  FaVideo, 
  FaCalendarAlt, 
  FaUser,
  FaChevronRight,
  FaGraduationCap
} from 'react-icons/fa';
import { 
  Calendar,
  FileText,
  Play,
  BookOpen,
  Home,
  Sparkles,
  Users
} from 'lucide-react';

const StudentSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const menuItems = [
    {
      to: "/student",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      end: true
    },
    {
      to: "/student/mycourses",
      icon: <BookOpen className="w-5 h-5" />,
      label: "My Courses"
    },
    {
      to: "/student/materials",
      icon: <FileText className="w-5 h-5" />,
      label: "Materials"
    },
    {
      to: "/student/videos",
      icon: <Play className="w-5 h-5" />,
      label: "Video Lectures"
    },
    {
      to: "/student/schedule",
      icon: <Calendar className="w-5 h-5" />,
      label: "Class Schedule"
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white w-64 fixed inset-y-0 left-0 z-30 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto`}
      >
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-900/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative px-6 py-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-br from-indigo-400 to-purple-600 p-2.5 rounded-xl shadow-lg">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-100 to-white bg-clip-text text-transparent">
                  Student Portal
                </h1>
                <p className="text-indigo-200 text-xs font-medium">Learning Journey</p>
              </div>
            </div>
            
            {/* Decorative Line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent mt-4"></div>
          </div>
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
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-indigo-100 hover:bg-indigo-700/50 hover:text-white hover:translate-x-1'
                }`
              }
              onClick={toggleSidebar}
            >
              {/* Active Indicator */}
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-indigo-300 rounded-r-full transition-all duration-200 ${
                ({isActive}) => isActive ? 'opacity-100' : 'opacity-0'
              }`} />
              
              {/* Icon */}
              <div className="relative">
                {item.icon}
                {/* Glow effect for active item */}
                <div className="absolute inset-0 rounded-full bg-indigo-300/20 scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              
              {/* Label */}
              <span className="font-medium tracking-wide">{item.label}</span>
              
              {/* Arrow for active item */}
              <FaChevronRight className="ml-auto w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400/0 via-indigo-400/5 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </NavLink>
          ))}
        </nav>
        
        {/* Quick Stats */}
        {/* <div className="px-4 mb-6">
          <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-600/30">
            <h3 className="text-indigo-100 text-sm font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-indigo-300">Enrolled Courses</span>
                <span className="text-indigo-100 font-medium">0</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-indigo-300">Completed</span>
                <span className="text-indigo-100 font-medium">0%</span>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Support Section */}
        {/* <div className="px-4 mb-6">
          <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-600/30">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-indigo-100 text-sm font-medium">Need Help?</p>
                <p className="text-indigo-300 text-xs">Contact Support</p>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Footer */}
        <div className="px-4 pt-4 border-t border-indigo-700/50">
          <div className="text-center">
            <div className="text-indigo-300 text-xs font-medium mb-1">
              &copy; {new Date().getFullYear()} LearnHub LMS
            </div>
            <div className="text-indigo-400 text-xs">
              Empowering Students
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-900/80 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default StudentSidebar;
