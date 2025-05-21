// import React, { useState } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import {
//   FiHome,
//   FiBook,
//   FiActivity,
//   FiFileText,
//   FiSettings,
//   FiLogOut,
//   FiMenu,
//   FiX,
// } from "react-icons/fi";

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     navigate("/login");
//   };

//   const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen text-gray-800">
//       {/* Mobile Header */}
//       <header className="flex justify-between items-center p-4 bg-[#4F46E5] text-white md:hidden">
//         <div className="text-lg font-semibold">Dashboard</div>
//         <button onClick={toggleMenu}>
//           {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//         </button>
//       </header>

//       {/* Sidebar */}
//       <aside
//         className={`${
//           mobileMenuOpen ? "block" : "hidden"
//         } md:block w-full md:w-64 bg-[#4F46E5] text-white flex-col justify-between p-6 md:flex`}
//       >
//         <div>
//           <nav className="space-y-6">
//             <Link to="dashboard" className="flex items-center gap-3 hover:text-white">
//               <FiHome /> Home
//             </Link>
//             <Link to="customers" className="flex items-center gap-3 hover:text-white">
//               <FiBook /> Courses
//             </Link>
//             <Link to="activities" className="flex items-center gap-3 hover:text-white">
//               <FiActivity /> MyCourses
//             </Link>
//             <Link to="reports" className="flex items-center gap-3 hover:text-white">
//               <FiFileText /> Agreement
//             </Link>
//           </nav>
//         </div>
//         <div className="space-y-6 mt-10 md:mt-0">
//           <Link to="settings" className="flex items-center gap-3 hover:text-white">
//             <FiSettings /> Settings
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 text-white hover:text-red-500"
//           >
//             <FiLogOut /> Log out
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 bg-gray-50 p-6 md:p-10">
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
//             <p className="text-gray-500">Welcome back, User</p>
//           </div>
//           <div className="flex items-center gap-3 mt-4 sm:mt-0">
//             <span className="text-sm text-gray-500">User</span>
//             <img
//               src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
//               alt="Profile"
//               className="w-10 h-10 rounded-full"
//             />
//           </div>
//         </div>

//         {/* Nested Routes */}
//         <div className="mt-6">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserDashboard;



import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FiHome, FiBook, FiActivity, FiSettings, FiLogOut, FiMenu, FiX,
} from "react-icons/fi";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-[#4F46E5] text-white md:hidden">
        <div className="text-lg font-semibold">Dashboard</div>
        <button onClick={toggleMenu}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-[#4F46E5] text-white flex-col justify-between p-6 md:flex`}>
        <div>
          <nav className="space-y-6">
            <Link to="home" className="flex items-center gap-3 hover:text-white"><FiHome /> Home</Link>
            <Link to="courses" className="flex items-center gap-3 hover:text-white"><FiBook /> Courses</Link>
            <Link to="pricing" className="flex items-center gap-3 hover:text-white"><FiBook /> Pricing</Link>
            <Link to="mycourse" className="flex items-center gap-3 hover:text-white"><FiActivity /> MyCourses</Link>
          </nav>
        </div>
        <div className="space-y-6 mt-10 md:mt-0">
          <Link to="settings" className="flex items-center gap-3 hover:text-white"><FiSettings /> Settings</Link>
          <button onClick={handleLogout} className="flex items-center gap-3 text-white hover:text-red-500"><FiLogOut /> Log out</button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 bg-gray-50 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
