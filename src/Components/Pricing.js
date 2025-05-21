import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Service from "../Assets/Service.png";
import basic from "../Assets/basic.png";
import standard from "../Assets/standard.png";
import bestvalue from "../Assets/bestvalue.png";

function Pricing({ minimal = false }) {
  const [showHeading, setShowHeading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowHeading(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStartDelegating = () => {
    const isLoggedIn = localStorage.getItem('authToken');

    if (isLoggedIn) {
      navigate('/useragreement');
    } else {
      toast.info('Please login for course purchase', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000); // match toast duration
    }
  };

  return (
    <div className="w-full bg-white text-gray-800">
      {/* HERO SECTION (conditional) */}
      {!minimal && (
        <section
          className="relative w-full h-[400px] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${Service})` }}
        >
          <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
          <div
            className={`z-20 transition-all duration-700 ease-in-out transform ${
              showHeading ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className="text-7xl font-bold text-white drop-shadow-lg mt-14">PRICING</h1>
          </div>
        </section>
      )}

      {/* PRICING SECTION */}
      <div className={`px-4 ${minimal ? 'pt-6' : 'py-10'} space-y-16`}>
        {!minimal && <h2 className="text-5xl font-bold text-center">PRICING PLANS</h2>}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {[basic, standard, bestvalue].map((planImg, index) => (
            <div key={index} className="relative w-full max-w-xs rounded-xl shadow-lg overflow-hidden">
              <img src={planImg} alt={`Plan ${index + 1}`} className="w-full h-auto" />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={handleStartDelegating}
                  className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg 
                    transition duration-300 ease-in-out transform 
                    hover:bg-indigo-700 hover:scale-105 hover:shadow-lg"
                >
                  Start Delegating
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
