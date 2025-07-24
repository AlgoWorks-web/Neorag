import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import axios from 'axios';

const StudentHeader = ({ toggleSidebar }) => {
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const studentUser = JSON.parse(localStorage.getItem('studentUser'));
    if (studentUser && studentUser.id) {
      axios
        // .get(`http://localhost:8000/api/student/${studentUser.id}`)
        .get(`https://hydersoft.com/api/student/${studentUser.id}`)
        .then(res => {
          setUsername(res.data.username);
        })
        .catch(err => {
          console.error('Failed to fetch student:', err);
        });
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('studentUser');
    window.location.href = '/login'; // redirect to login/home
  };

  return (
    <header className="fixed w-full bg-white shadow-md z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-600 mr-4 focus:outline-none"
          >
            <FiMenu className="text-2xl" />
          </button>
          <h1 className="text-xl font-bold text-indigo-700">LearnHub Student Portal</h1>
        </div>

        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
          <button className="relative text-gray-600 hover:text-indigo-700">
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">3</span>
          </button>

          <button className="relative text-gray-600 hover:text-indigo-700">
            <FaEnvelope className="text-xl" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">5</span>
          </button>

          <div className="flex items-center">
            <div className="mr-3 text-right hidden md:block">
              <p className="text-sm font-medium text-gray-800">
                {username ? username : 'Loading...'}
              </p>
              <p className="text-xs text-gray-500">Student</p>
            </div>

            <div className="relative">
              <button
                className="text-gray-600 hover:text-indigo-700 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FaUserCircle className="text-2xl" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-20">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
