import { FaBars } from 'react-icons/fa';

const AdminHeader = ({ toggleSidebar }) => {
  return (
   <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-4 flex items-center fixed top-0 left-0 right-0 z-40 h-16 shadow-lg">
      <button 
        className="md:hidden mr-4 p-1 rounded-md hover:bg-indigo-700 transition-colors"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <FaBars className="text-xl" />
      </button>
      <span className="ml-auto text-xl font-semibold tracking-tight">NeoRAG Admin</span>
    </div>
  );
};

export default AdminHeader;