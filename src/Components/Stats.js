import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import counter1 from '../Assets/counter1.png';
import counter2 from '../Assets/counter2.png';
import counter3 from '../Assets/counter3.png';
import counter4 from '../Assets/counter4.png';
import Image2 from '../Assets/mission.png';

function Stats() {
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("stats-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setStartCount(true);
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <section id="stats-section" className="relative bg-black text-white py-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${Image2})` }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[ 
            { icon: counter1, number: 10, label: "TOP TALENT POOL" },
            { icon: counter2, number: 100,  label: "COMPLETED PROJECTS" },
            { icon: counter3, number: 4999, label: "GLOBAL REACH" },
            { icon: counter4, number: 160, label: "EXPERT CONSULTANT" },
          ].map((stat, index) => (
            <div
              key={index}
              className="p-6 border border-gray-700 bg-black/60 rounded-lg hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <img src={stat.icon} alt={stat.label} className="mx-auto mb-4 h-14 w-14" />
              <h3 className="text-3xl font-bold text-blue-400">
                {startCount ? <CountUp start={0} end={stat.number} duration={3} /> : 0}
              </h3>
              <p className="mt-2 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Stats;