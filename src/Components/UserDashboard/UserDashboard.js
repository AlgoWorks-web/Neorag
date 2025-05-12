// import React, { useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
//             <NavLink to="dashboard" className="flex items-center gap-3 hover:text-white">
//               <FiHome /> Home
//             </NavLink>
//             <NavLink to="customers" className="flex items-center gap-3 hover:text-white">
//               <FiBook /> Courses
//             </NavLink>
//             <NavLink to="activities" className="flex items-center gap-3 hover:text-white">
//               <FiActivity /> MyCourses
//             </NavLink>
//             <NavLink to="reports" className="flex items-center gap-3 hover:text-white">
//               <FiFileText /> Agreement
//             </NavLink>
//           </nav>
//         </div>
//         <div className="space-y-6 mt-10 md:mt-0">
//           <NavLink to="settings" className="flex items-center gap-3 hover:text-white">
//             <FiSettings /> Settings
//           </NavLink>
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
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiActivity,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const sampleVideos = Array(9).fill("https://www.youtube.com/embed/dQw4w9WgXcQ"); // placeholder
  const placedStudents = [
    { name: "Mantu Kumar", tag: "IPE 2024" },
    { name: "Vinayak Kittad", tag: "ME 2020" },
    { name: "Raghavendra Bichala", tag: "CSE 2022" },
    { name: "Manu HN", tag: "CE 2022" },
    { name: "Harsh Verma", tag: "ECE 2023" },
    { name: "Saim A. Sheikh", tag: "CSE 2024" },
    { name: "Chetan Anand", tag: "" },
    { name: "Prajwal Shukla", tag: "" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-gray-800">
      {/* Mobile Header */}
      <header className="flex justify-between items-center p-4 bg-[#4F46E5] text-white md:hidden">
        <div className="text-lg font-semibold">Dashboard</div>
        <button onClick={toggleMenu}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#4F46E5] text-white flex-col justify-between p-6 md:flex`}
      >
        <div>
          <nav className="space-y-6">
            <NavLink to="dashboard" className="flex items-center gap-3 hover:text-white">
              <FiHome /> Home
            </NavLink>
            <NavLink to="customers" className="flex items-center gap-3 hover:text-white">
              <FiBook /> Courses
            </NavLink>
            <NavLink to="activities" className="flex items-center gap-3 hover:text-white">
              <FiActivity /> MyCourses
            </NavLink>
            <NavLink to="reports" className="flex items-center gap-3 hover:text-white">
              <FiFileText /> Agreement
            </NavLink>
          </nav>
        </div>
        <div className="space-y-6 mt-10 md:mt-0">
          <NavLink to="settings" className="flex items-center gap-3 hover:text-white">
            <FiSettings /> Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-white hover:text-red-500"
          >
            <FiLogOut /> Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 md:p-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back, User</p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <span className="text-sm text-gray-500">User</span>
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Center: Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
            {sampleVideos.map((url, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-4">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <iframe
                    src={url}
                    title={`video-${idx}`}
                    className="w-full h-48 rounded"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition">
                  Register Now
                </button>
              </div>
            ))}
          </div>

          {/* Right: Students Placed & More Videos */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Students Placed */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-xl font-bold text-center text-purple-600 mb-4">
                🎉 300+ Students Placed
              </h2>
              <div className="max-h-80 overflow-y-auto space-y-4">
                {placedStudents.map((student, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      alt="Student"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.tag}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* More Videos */}
            <div className="bg-white p-4 mb-5 mt-6 rounded-xl shadow">
  <h2 className="text-lg font-semibold mb-4">More Videos</h2>
  <div className="space-y-4 max-h-72 overflow-y-auto">
    {sampleVideos.slice(0, 4).map((url, idx) => (
      <iframe
        key={idx}
        src={url}
        className="w-full h-40 rounded"
        title={`extra-${idx}`}
        frameBorder="0"
        allowFullScreen
      />
    ))}
  </div>
</div>

          </div>
        </div>

        {/* Nested Routes */}
        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
