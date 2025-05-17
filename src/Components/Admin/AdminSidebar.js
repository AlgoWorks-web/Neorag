import { FaTimes, FaUsers, FaGem, FaBell, FaCog, FaSymfony } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`bg-white w-60 md:w-60 fixed h-full z-30 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'left-0' : '-left-64 md:left-0'
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
            <div>
              <p className="font-semibold">Welcome, <strong>Admin</strong></p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h5 className="font-bold text-lg">Dashboard</h5>
        </div>
        
        <nav className="mb-4">
          <button 
            className="md:hidden w-full flex items-center p-4 bg-gray-700 text-white hover:bg-black"
            onClick={toggleSidebar}
          >
            <FaTimes className="mr-2" /> Close Menu
          </button>
          
          <NavLink 
            to="/admin-home" 
            end
            className={({ isActive }) => 
              `flex items-center p-4 ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
            }
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            <FaUsers className="mr-3" /> Overview
          </NavLink>
          
          {/* Other NavLinks with same onClick for mobile */}
          {[
            { to: "users", icon: <FaUsers className="mr-3" />, text: "Users" },
            { to: "courses", icon: <FaGem className="mr-3" />, text: "Courses" },
             { to: "plans", icon: <FaSymfony className="mr-3" />, text: "Plans" },
            { to: "reports", icon: <FaBell className="mr-3" />, text: "Reports" },
            { to: "settings", icon: <FaCog className="mr-3" />, text: "Settings" }
          ].map((item) => (
            <NavLink 
              key={item.to}
              to={`/admin-home/${item.to}`}
              className={({ isActive }) => 
                `flex items-center p-4 ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
              }
              onClick={() => window.innerWidth < 768 && toggleSidebar()}
            >
              {item.icon} {item.text}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;