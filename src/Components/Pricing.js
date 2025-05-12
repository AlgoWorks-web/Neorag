// import React, { useEffect, useState } from 'react';
// import Service from "../Assets/Service.png";
// import basic from "../Assets/basic.png";
// import standard from "../Assets/standard.png";
// import bestvalue from "../Assets/bestvalue.png";

// function Pricing() {
//   const [showHeading, setShowHeading] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowHeading(true), 100); // slight delay
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="w-full bg-white text-gray-800">
//       {/* HERO SECTION */}
//       <section
//         className="relative w-full h-[400px] flex items-center justify-center bg-cover bg-center"
//         style={{ backgroundImage: `url(${Service})` }}
//       >
//         <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
//         <div
//           className={`z-20 transition-all duration-700 ease-in-out transform ${
//             showHeading ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
//           }`}
//         >
//           <h1 className="text-7xl font-bold text-white drop-shadow-lg mt-14">PRICING</h1>
//         </div>
//       </section>

//       {/* PRICING SECTION */}
//       <div className="px-4 py-10 space-y-16">
//         <h2 className="text-5xl font-bold text-center">PRICING PLANS</h2>

//         {/* IMAGE COLUMNS WITH BUTTONS INSIDE */}
//         <div className="flex flex-col md:flex-row justify-center items-center gap-8">
//           {/* Basic Plan */}
//           <div className="relative w-full max-w-xs rounded-xl shadow-lg overflow-hidden">
//             <img src={basic} alt="Basic Plan" className="w-full h-auto" />
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
//               <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg 
//                 transition duration-300 ease-in-out transform 
//                 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg">
//                 Start Delegating
//               </button>
//             </div>
//           </div>

//           {/* Standard Plan */}
//           <div className="relative w-full max-w-xs rounded-xl shadow-lg overflow-hidden">
//             <img src={standard} alt="Standard Plan" className="w-full h-auto" />
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
//               <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg 
//                 transition duration-300 ease-in-out transform 
//                 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg">
//                 Start Delegating
//               </button>
//             </div>
//           </div>

//           {/* Best Value Plan */}
//           <div className="relative w-full max-w-xs rounded-xl shadow-lg overflow-hidden">
//             <img src={bestvalue} alt="Best Value Plan" className="w-full h-auto" />
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
//               <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg 
//                 transition duration-300 ease-in-out transform 
//                 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg">
//                 Start Delegating
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Pricing;




import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Step 1
import Service from "../Assets/Service.png";
import basic from "../Assets/basic.png";
import standard from "../Assets/standard.png";
import bestvalue from "../Assets/bestvalue.png";

function Pricing() {
  const [showHeading, setShowHeading] = useState(false);
  const navigate = useNavigate(); // ✅ Step 2

  useEffect(() => {
    const timer = setTimeout(() => setShowHeading(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStartDelegating = () => {
    navigate('/useragreement'); // ✅ Step 3
  };

  return (
    <div className="w-full bg-white text-gray-800">
      {/* HERO SECTION */}
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

      {/* PRICING SECTION */}
      <div className="px-4 py-10 space-y-16">
        <h2 className="text-5xl font-bold text-center">PRICING PLANS</h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Basic Plan */}
          <div className="relative w-full max-w-xs rounded-xl shadow-lg overflow-hidden">
            <img src={basic} alt="Basic Plan" className="w-full h-auto" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={handleStartDelegating} // ✅ Updated
                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg 
                  transition duration-300 ease-in-out transform 
                  hover:bg-indigo-700 hover:scale-105 hover:shadow-lg"
              >
                Start Delegating
              </button>
            </div>
          </div>

          {/* Standard Plan */}
          <div className="relative w-full max-w-xs rounded-xl shadow-lg overflow-hidden">
            <img src={standard} alt="Standard Plan" className="w-full h-auto" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={handleStartDelegating} // ✅ Updated
                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg 
                  transition duration-300 ease-in-out transform 
                  hover:bg-indigo-700 hover:scale-105 hover:shadow-lg"
              >
                Start Delegating
              </button>
            </div>
          </div>

          {/* Best Value Plan */}
          <div className="relative w-full max-w-xs rounded-xl shadow-lg overflow-hidden">
            <img src={bestvalue} alt="Best Value Plan" className="w-full h-auto" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={handleStartDelegating} // ✅ Updated
                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg 
                  transition duration-300 ease-in-out transform 
                  hover:bg-indigo-700 hover:scale-105 hover:shadow-lg"
              >
                Start Delegating
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
