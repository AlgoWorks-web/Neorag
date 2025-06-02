// src/Components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/CompanyLogo.jpg";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Company Info */}
          <div>
            <img src={logo} alt="Neorag" className="h-16 w-auto mb-6" />
            <p className="text-blue-200 mb-6">
              Empowering the next generation of tech professionals with industry-leading education.
            </p>
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
                  className="bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
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
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Courses", path: "/services" },
                { name: "Pricing", path: "/pricing" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-blue-200 hover:text-white transition-colors"
                    onClick={() => window.scrollTo(0, 0)} // Scroll to top on navigation
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-6">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: "FAQ", path: "/faq" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-blue-200 hover:text-white transition-colors"
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
            <h3 className="text-lg font-bold mb-6">Stay Updated</h3>
            <p className="text-blue-200 mb-4">
              Subscribe to our newsletter for course updates and career tips.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 rounded-r-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-blue-800 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Neorag Solutions LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link 
                to="/privacy" 
                className="text-blue-300 hover:text-white transition-colors"
                onClick={() => window.scrollTo(0, 0)}
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-blue-300 hover:text-white transition-colors"
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