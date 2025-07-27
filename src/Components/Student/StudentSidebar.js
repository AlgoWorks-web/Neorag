import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaFileAlt, 
  FaVideo, 
  FaCalendarAlt, 
  FaUser 
} from 'react-icons/fa';

const StudentSidebar = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div 
      className={`bg-indigo-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 z-30 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition duration-200 ease-in-out h-full overflow-y-auto`}
    >
      <div className="text-white flex items-center space-x-2 px-4">
        <span className="text-2xl font-bold">Student Portal</span>
      </div>
      
      <nav className="space-y-1">
        <NavLink 
          to="/student" 
          end
          className={({isActive}) => 
            `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ${
              isActive ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaHome className="text-lg" />
          <span>Dashboard</span>
        </NavLink>

        {/* <NavLink 
          to="courses" 
          className={({isActive}) => 
            `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ${
              isActive ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaBook className="text-lg" />
          <span>Courses</span>
        </NavLink> */}
        
        <NavLink 
          to="mycourses" 
          className={({isActive}) => 
            `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ${
              isActive ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaBook className="text-lg" />
          <span>My Courses</span>
        </NavLink>

        
        <NavLink 
          to="/student/materials" 
          className={({isActive}) => 
            `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ${
              isActive ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaFileAlt className="text-lg" />
          <span>Materials</span>
        </NavLink>
        
        <NavLink 
          to="/student/videos" 
          className={({isActive}) => 
            `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ${
              isActive ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaVideo className="text-lg" />
          <span>Video Lectures</span>
        </NavLink>
        
        <NavLink 
          to="/student/schedule" 
          className={({isActive}) => 
            `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ${
              isActive ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaCalendarAlt className="text-lg" />
          <span>Class Schedule</span>
        </NavLink>
        
        {/* <NavLink 
          to="studentprofile" 
          className={({isActive}) => 
            `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ${
              isActive ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-700'
            }`
          }
          onClick={toggleSidebar}
        >
          <FaUser className="text-lg" />
          <span>Profile</span>
        </NavLink> */}
      </nav>
      
      <div className="px-4 pt-10 border-t border-indigo-700">
        <div className="text-indigo-300 text-sm">
          &copy; {new Date().getFullYear()} LearnHub LMS
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;