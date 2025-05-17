// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaBars, FaTimes } from "react-icons/fa";
// import logo from '../Assets/Neoraglogo.png';

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about" },
//     { name: "Services", path: "/services" },
//     { name: "Case Studies", path: "/case-studies" },
//     { name: "Pricing", path: "/pricing" },
//     { name: "Contact", path: "/contact" },
//   ];

//   return (
//     <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md w-full relative">
//     {/* Left: Logo */}
//     <div className="h-24 w-32 overflow-hidden">
//       <Link to="/">
//         {/* <img src={logo} alt="Logo" className="h-38 w-46 object-contain" /> */}
//         <img src={logo} alt="Logo" className="h-42 w-86 object-contain mb-12" />
//       </Link>
//     </div>
  
  
//       {/* Mobile Menu Button */}
//       <button
//         className="md:hidden text-2xl text-gray-800"
//         onClick={() => setMenuOpen(!menuOpen)}
//       >
//         {menuOpen ? <FaTimes /> : <FaBars />}
//       </button>

//       {/* Center: Nav Items (Desktop) */}
//       <ul className="hidden md:flex space-x-6 text-lg font-medium">
//         {navItems.map((item) => (
//           <li key={item.name}>
//             <Link
//               to={item.path}
//               className="text-blue-900 hover:underline hover:text-red-500 transition duration-200 hover:underline-offset-4"
//             >
//               {item.name}
//             </Link>
//           </li>
//         ))}
//       </ul>

//       {/* Right: Buttons (Desktop) */}
//       <div className="hidden md:flex space-x-4">
//         <Link
//           to="/login"
//           className="px-4 py-2 border border-blue-600 text-blue-900 hover:bg-blue-600 hover:text-white transition"
//         >
//           Login
//         </Link>
//         <Link
//           to="/signup"
//           className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition"
//         >
//           Sign Up
//         </Link>
//       </div>

//       {/* Mobile Menu (Only shown when menuOpen is true) */}
//       <div
//         className={`fixed inset-0 z-50 bg-white shadow-lg transform ${
//           menuOpen ? "translate-x-0" : "-translate-x-full"
//         } transition-transform duration-300 md:hidden`}
//       >
//         {/* Close button inside menu */}
//         <div className="flex justify-between items-center p-4">
//           <Link to="/" onClick={() => setMenuOpen(false)}>
//             <img src={logo} alt="Logo" className="h-10 w-auto" />
//           </Link>
//           <button
//             className="text-2xl text-gray-800"
//             onClick={() => setMenuOpen(false)}
//           >
//             <FaTimes />
//           </button>
//         </div>

//         <ul className="flex flex-col items-center space-y-6 mt-8">
//           {navItems.map((item) => (
//             <li key={item.name}>
//               <Link
//                 to={item.path}
//                 className="text-blue-900 text-lg font-semibold hover:text-red-500 hover:underline hover:underline-offset-4 transition duration-200"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {item.name}
//               </Link>
//             </li>
//           ))}
//         </ul>

//         {/* Buttons for Mobile */}
//         <div className="mt-8 flex flex-col items-center space-y-4">
//           <Link
//             to="/login"
//             className="text-center w-3/4 px-4 py-2 border border-blue-600 text-blue-900  hover:bg-blue-600 hover:text-white transition"
//             onClick={() => setMenuOpen(false)}
//           >
//             Login
//           </Link>
//           <Link
//             to="/signup"
//             className="text-center w-3/4 px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition"
//             onClick={() => setMenuOpen(false)}
//           >
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../Assets/Neoraglogo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-white shadow-md w-full relative md:py-4 md:h-24">
      {/* Left: Logo */}
      <div className="h-12 w-32 overflow-hidden md:h-20 md:w-auto">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-16 w-auto object-contain md:h-20"
          />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl text-gray-800"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Center: Nav Items (Desktop) */}
      <ul className="hidden md:flex space-x-6 text-lg font-medium">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className="text-blue-900 hover:underline hover:text-red-500 transition duration-200 hover:underline-offset-4"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right: Buttons (Desktop) */}
      <div className="hidden md:flex space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 border border-blue-600 text-blue-900 hover:bg-blue-600 hover:text-white transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu (Only shown when menuOpen is true) */}
      <div
        className={`fixed inset-0 z-50 bg-white shadow-lg transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:hidden`}
      >
        {/* Close button inside menu */}
        <div className="flex justify-between items-center p-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            className="text-2xl text-gray-800"
            onClick={() => setMenuOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Mobile Nav Items */}
        <ul className="flex flex-col items-center space-y-6 mt-8">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="text-blue-900 text-lg font-semibold hover:text-red-500 hover:underline hover:underline-offset-4 transition duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Buttons */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <Link
            to="/login"
            className="text-center w-3/4 px-4 py-2 border border-blue-600 text-blue-900 hover:bg-blue-600 hover:text-white transition"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-center w-3/4 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
