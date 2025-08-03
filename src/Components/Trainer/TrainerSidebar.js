import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaUser, 
  FaVideo, 
  FaFileAlt, 
  FaChevronRight,
  FaGraduationCap
} from 'react-icons/fa';
import { 
  Calendar,
  Upload,
  Play,
  FileText,
  User,
  Home,
  Sparkles
} from 'lucide-react';

const TrainerSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const menuItems = [
    {
      to: "/trainer",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      end: true
    },
    {
      to: "/trainer/training-info",
      icon: <Calendar className="w-5 h-5" />,
      label: "Class Schedule"
    },
    {
      to: "/trainer/materials",
      icon: <FileText className="w-5 h-5" />,
      label: "Materials"
    },
    {
      to: "/trainer/videos",
      icon: <Play className="w-5 h-5" />,
      label: "Videos"
    },
    {
      to: "/trainer/profile",
      icon: <User className="w-5 h-5" />,
      label: "Profile"
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
        className={`bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white w-64 fixed inset-y-0 left-0 z-40 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl`}
      >
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-900/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative px-6 py-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2.5 rounded-xl shadow-lg">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                  Trainer Portal
                </h1>
                <p className="text-blue-200 text-xs font-medium">Teaching Excellence</p>
              </div>
            </div>
            
            {/* Decorative Line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent mt-4"></div>
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
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-blue-100 hover:bg-blue-700/50 hover:text-white hover:translate-x-1'
                }`
              }
              onClick={toggleSidebar}
            >
              {/* Active Indicator */}
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r-full transition-all duration-200 ${
                ({isActive}) => isActive ? 'opacity-100' : 'opacity-0'
              }`} />
              
              {/* Icon */}
              <div className="relative">
                {item.icon}
                {/* Glow effect for active item */}
                <div className="absolute inset-0 rounded-full bg-blue-300/20 scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              
              {/* Label */}
              <span className="font-medium tracking-wide">{item.label}</span>
              
              {/* Arrow for active item */}
              <FaChevronRight className="ml-auto w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </NavLink>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-blue-800/50 rounded-lg p-4 border border-blue-600/30">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-blue-100 text-sm font-medium">© 2025 LearnHub LMS
</p>
               
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-900/80 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default TrainerSidebar;
