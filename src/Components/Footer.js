// // src/Components/Footer.js
// import React from "react";
// import { Link } from "react-router-dom";
// import logo from "../Assets/Neoraglogo.png";
// import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-gray-50 text-gray-800 pt-16 pb-8 border-t border-gray-200">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

// {/* Company Info */}
//           <div>
//            <div><img src={logo} alt="Neorag" className="h-48 w-48 " /></div>
//             <p className="text-blue-700 mb-6">
//               Empowering the next generation of tech professionals with industry-leading education.
//             </p>
//             <div className="flex space-x-4">
//               {[
//                 { icon: <FaFacebookF />, url: "#" },
//                 { icon: <FaLinkedinIn />, url: "#" },
//                 { icon: <FaTwitter />, url: "#" },
//                 { icon: <FaInstagram />, url: "#" },
//                 { icon: <FaYoutube />, url: "#" }
//               ].map((social, index) => (
//                 <a 
//                   key={index}
//                   href={social.url}
//                   className="bg-gray-300 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {social.icon}
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-lg font-bold mb-6 text-gray-900">Quick Links</h3>
//             <ul className="space-y-3">
//               {[
//                 { name: "Home", path: "/" },
//                 { name: "Courses", path: "/services" },
//                 // { name: "Pricing", path: "/pricing" },
//                 { name: "About Us", path: "/about" },
//                 { name: "Contact", path: "/contact" }
//               ].map((item, index) => (
//                 <li key={index}>
//                   <Link 
//                     to={item.path} 
//                     className="text-blue-700 hover:text-blue-900 transition-colors"
//                     onClick={() => window.scrollTo(0, 0)}
//                   >
//                     {item.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Resources */}
//           <div>
//             <h3 className="text-lg font-bold mb-6 text-gray-900">Resources</h3>
//             <ul className="space-y-3">
//               {[
//                 { name: "FAQ", path: "/faq" }
//               ].map((item, index) => (
//                 <li key={index}>
//                   <Link 
//                     to={item.path} 
//                     className="text-blue-700 hover:text-blue-900 transition-colors"
//                     onClick={() => window.scrollTo(0, 0)}
//                   >
//                     {item.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Newsletter */}
//           <div>
//             <h3 className="text-lg font-bold mb-6 text-gray-900">Stay Updated</h3>
//             <p className="text-blue-700 mb-4">
//               Subscribe to our newsletter for course updates and career tips.
//             </p>
//             <form className="flex">
//               <input
//                 type="email"
//                 placeholder="Your email address"
//                 className="flex-grow px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none border border-gray-300 focus:border-blue-500"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-3 rounded-r-lg font-medium hover:bg-blue-700 transition-all"
//               >
//                 Subscribe
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Bottom Footer */}
//         <div className="border-t border-gray-200 pt-8 pb-4">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-500 text-sm mb-4 md:mb-0">
//               &copy; {currentYear} Neorag Solutions LLC. All rights reserved.
//             </p>
//             <div className="flex space-x-6 text-sm">
//               <Link 
//                 to="/privacy" 
//                 className="text-gray-600 hover:text-blue-600 transition-colors"
//                 onClick={() => window.scrollTo(0, 0)}
//               >
//                 Privacy Policy
//               </Link>
//               <Link 
//                 to="/terms" 
//                 className="text-gray-600 hover:text-blue-600 transition-colors"
//                 onClick={() => window.scrollTo(0, 0)}
//               >
//                 Terms of Service
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
// src/Components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/Neoraglogo.png";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-800 pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="">
              <img
                src={logo}
                alt="Neorag"
                className="h-32 w-auto sm:h-40 md:h-48 lg:h-56 xl:h-64 object-contain"
              />
            </div>
            <div>
            <p className="text-blue-700 mb-6 text-sm sm:text-base leading-relaxed max-w-sm">
              Empowering the next generation of tech professionals with industry-leading education.
            </p></div>
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebookF />, url: "#" },
                { icon: <FaLinkedinIn />, url: "#" },
                { icon: <FaTwitter />, url: "#" },
                { icon: <FaInstagram />, url: "#" },
                { icon: <FaYoutube />, url: "#" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="bg-gray-300 text-blue-700 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm sm:text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Courses", path: "/publiccourses" },
                // { name: "Pricing", path: "/pricing" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: "FAQ", path: "/publicfaqs" }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Stay Updated</h3>
            <p className="text-blue-700 mb-4 text-sm sm:text-base">
              Subscribe to our newsletter for course updates and career tips.
            </p>
            <form className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-l-lg sm:rounded-r-none rounded-r-lg text-gray-800 focus:outline-none border border-gray-300 focus:border-blue-500 mb-2 sm:mb-0"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-3 rounded-r-lg sm:rounded-l-none rounded-l-lg font-medium hover:bg-blue-700 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Neorag Solutions LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => window.scrollTo(0, 0)}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => window.scrollTo(0, 0)}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
