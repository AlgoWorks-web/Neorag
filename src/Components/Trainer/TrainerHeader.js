// src/components/Trainer/TrainerHeader.js
import React from 'react';
import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TrainerHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const trainerData = JSON.parse(localStorage.getItem("trainerUser"));
  const trainerName = trainerData?.name || "Trainer";

  const handleLogout = () => {
    localStorage.removeItem("trainerUser");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button
            className="mr-4 text-gray-600 focus:outline-none md:hidden"
            onClick={toggleSidebar}
          >
            <FaBars className="text-xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Trainer Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-1 text-gray-500 hover:text-gray-700">
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center">
            <div className="mr-3 text-right">
              <p className="text-sm font-medium text-gray-700">{trainerName}</p>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-blue-600"
              >
                Logout
              </button>
            </div>
            <FaUserCircle className="text-3xl text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};


export default TrainerHeader;
