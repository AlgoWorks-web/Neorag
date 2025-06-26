import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../Assets/NeoragLogoTransparent.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/services" },
    { name: "Business", path: "/business" },
    // { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled || !isHomePage
        ? "bg-white shadow-lg py-2"
        : "bg-gradient-to-r from-sky-100 via-blue-50 to-sky-100 bg-opacity-95 py-4"
    }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="z-50">
          <img src={logo} alt="Neorag" className="h-12 md:h-16 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`
                    relative 
                    font-medium 
                    transition-all 
                    duration-300 
                    px-2 
                    py-1
                    ${scrolled || !isHomePage ? "text-black-800" : "text-blue-900"}
                    hover:after:content-[''] 
                    hover:after:absolute 
                    hover:after:left-0 
                    hover:after:bottom-0 
                    hover:after:w-full 
                    hover:after:h-0.5 
                    hover:after:bg-blue-500
                  `}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className={`
                px-5 
                py-2 
                font-medium 
                ${scrolled || !isHomePage ? "text-gray-800" : "text-blue-900"}
                hover:underline
                hover:underline-offset-4
                hover:decoration-blue-500
              `}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`
                px-5 
                py-2 
                bg-gradient-to-r 
                from-blue-500 
                to-indigo-600 
                text-white 
                font-medium 
                rounded-full 
                hover:from-blue-600 
                hover:to-indigo-700 
                transition-all 
                ${scrolled || !isHomePage ? "shadow-lg hover:shadow-xl" : "shadow-xl"}
              `}
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl z-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <FaTimes className="text-white" />
          ) : (
            <FaBars className={scrolled || !isHomePage ? "text-gray-800" : "text-white"} />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-gradient-to-br from-blue-800 to-indigo-900 z-40 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <ul className="text-center space-y-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`
                    text-2xl 
                    font-bold 
                    ${location.pathname === item.path
                      ? "text-white border-b-2 border-white"
                      : "text-blue-200 hover:text-white"}
                  `}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col space-y-4 w-full max-w-xs px-4">
            <Link
              to="/login"
              className="w-full py-3 text-center bg-white text-blue-600 font-bold rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="w-full py-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
