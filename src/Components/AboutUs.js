import React, { useEffect, useState, useRef } from "react";
import Image2 from "../Assets/Image2.jpg";
import icon from "../Assets/icon.jpg";
import Image1 from "../Assets/Image1.jpg";
import team1 from "../Assets/team1.jpg";
import team2 from "../Assets/team2.jpg";
import team3 from "../Assets/team3.jpg";
import footer from "../Assets/footer.png";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";
import Stats from "./Stats";

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [iconVisible, setIconVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);

  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.5 };

    const createObserver = (ref, setState) => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setState(true);
          observer.disconnect();
        }
      }, observerOptions);
      observer.observe(ref.current);
    };

    createObserver(sectionRef, setIsVisible);
    createObserver(textRef, setTextVisible);
    createObserver(iconRef, setIconVisible);
    createObserver(teamRef, setTeamVisible);
  }, []);

  const teamMembers = [
    { img: team1, role: "CHIEF EXECUTIVE", name: "DURAN MOSA" },
    { img: team2, role: "LEAD CONSULTANT", name: "MILANI COSTAL" },
    { img: team3, role: "HR CONSULTANT", name: "ALISHIA JONS" },
  ];

  return (
    <div className="bg-white text-gray-800 w-full">
      {/* Banner */}
      <div ref={sectionRef} className="relative w-full h-50 md:h-80 lg:h-96 overflow-hidden">
        <img src={Image2} alt="Company Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2
            className={`text-white text-4xl md:text-5xl font-bold transition-all duration-1000 ease-in-out transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            ABOUT US
          </h2>
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">
          <div
            ref={textRef}
            className={`lg:w-1/2 text-left transition-all duration-1000 ease-in-out transform ${
              textVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            <h2 className="text-5xl font-extrabold mb-4 leading-tight">
              OUR VISION <br /> SUCCESSFUL BUSINESS
            </h2>
            <h4 className="text-xl font-semibold mb-4">
              At <b>Neorag</b>, we empower businesses with knowledge, innovation, and expert guidance.
            </h4>
            <p className="text-lg text-gray-700">
              We bridge the gap between learning and real-world success through high-quality courses.
              Our goal is to help professionals and entrepreneurs stay ahead in a competitive world.
              <br />
              Join us and take your business to the next level with the right expertise and mentorship!
            </p>
          </div>
          <div className="lg:w-1/2 relative flex justify-center">
            <img src={Image1} alt="Business growth visual" className="w-full max-w-md h-auto object-cover" />
            <div
              ref={iconRef}
              className={`absolute top-8 left-0 transition-all duration-1000 ease-in-out transform ${
                iconVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
              }`}
            >
              <img src={icon} alt="Neorag Icon" className="w-20 h-20 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Consulting Team */}
      <section className="bg-gray-100 py-12 text-center">
        <h2 className="text-3xl font-bold mb-2">CONSULTING TEAM</h2>
        <p className="text-lg mb-10">Podcasting operational change management</p>
        <div
          ref={teamRef}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 transition-all duration-1000 ease-in-out transform ${
            teamVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative rounded overflow-hidden shadow hover:shadow-lg bg-white"
            >
              <img
                src={member.img}
                alt={`Team member ${index + 1}`}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white px-4 py-3 text-left">
                <p className="text-sm font-medium">{member.role}</p>
                <h4 className="text-lg font-bold mb-2">{member.name}</h4>
                <div className="flex gap-3">
                  {[FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-white hover:text-blue-400 transition duration-300 ease-in-out"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <div>
        <Stats />
      </div>

      {/* Footer CTA */}
      <section
        className="w-full bg-blue-800 min-h-[200px] py-20 px-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${footer})` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between h-full mt-10">
          <h2
            className={`text-white font-bold text-5xl text-center md:text-left mb-6 md:mb-0 transition-all duration-1000 ease-in-out transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            WE’RE DELIVERING THE BEST <br className="hidden md:block" />
            CUSTOMER EXPERIENCE
          </h2>
          <a
            href="#"
            className={`bg-white text-black font-semibold px-6 py-4 rounded shadow transition-all duration-1000 ease-in-out transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            } hover:shadow-lg hover:text-blue-800 hover:scale-105`}
          >
            LET'S GET STARTED
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
