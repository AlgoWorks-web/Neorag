import React from "react";
import { useEffect, useState, useRef } from "react";
import backgroundimage from "../Assets/background.png";
import leadingMain from "../Assets/leading-market-main-image.jpg";
import leadingsmall from "../Assets/leading-market-small-image.png";
import image1 from "../Assets/caseimage1.jpg";
import image2 from '../Assets/caseimage2.jpg';
import image3 from '../Assets/caseimage3.jpg';
import icon1 from '../Assets/icon1.jpg';
import icon2 from '../Assets/icon2.jpg';
import icon3 from '../Assets/icon3.jpg';
import missionbackground from '../Assets/mission.png';
import Stats from "./Stats";

const HomePage = () => {
  const [consultingProgress, setConsultingProgress] = useState(0);
  const [advicesProgress, setAdvicesProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setConsultingProgress(88), 500);
          setTimeout(() => setAdvicesProgress(55), 1000);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const textObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTextVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (textRef.current) {
      textObserver.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        textObserver.unobserve(textRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => {
      if (servicesRef.current) {
        observer.unobserve(servicesRef.current);
      }
    };
  }, []);

  const caseStudies = [
    {
      id: 1,
      image: image1,
      icon: icon1,
      title: "BUSINESSES GROWTH",
      subtitle: "THOUGHT LEADERSHIP",
    },
    {
      id: 2,
      image: image2,
      icon: icon2,
      title: "MARKETING ADVICE",
      subtitle: "RISK MANAGEMENT",
    },
    {
      id: 3,
      image: image3,
      icon: icon3,
      title: "FINANCE CONSULTING",
      subtitle: "BUSINESS STRATEGY",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center text-white bg-black">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={backgroundimage}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Content */}
        <div className="relative text-left max-w-xl md:max-w-2xl px-4 md:px-6 z-10 mx-4 md:mr-12 lg:mr-72">
          <p
            ref={textRef}
            className={`text-sm md:text-lg mb-4 text-white font-semibold transition-transform duration-1000 
    ${textVisible ? "md:translate-x-0 md:opacity-100" : "md:-translate-x-full md:opacity-0"}
    translate-x-0 opacity-100`}
          >
            Innovative Research, Consulting, and Staffing Services for a Global Market.
          </p>

          <h6 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white">
            EMPOWERING BUSINESS WITH ACTIONABLE INSIGHTS & EXPERTISE
          </h6>

          <a href="#"
            className="inline-block bg-blue-600 text-white font-bold py-3 px-6 md:py-6 md:px-10 transition-all duration-300 ease-in-out transform hover:bg-blue-700 hover:translate-y-[-5px]"
          >
            EXPLORE SERVICES
          </a>
        </div>
      </section>

      {/* Service Section */}
      <div className="text-3xl md:text-5xl font-bold text-center mt-8 md:mt-4">SERVICES</div>
      <div className="text-center mt-2 px-4">The best business consulting firm you can count on!</div>

      <section ref={sectionRef} className="flex flex-col md:flex-row flex-wrap justify-between items-center px-6 md:px-12 lg:px-20 py-8 md:py-16 bg-white">
        <div className="relative w-full md:w-1/2 mt-4 flex justify-center md:justify-start">
          <img
            src={leadingMain}
            alt="Consulting"
            className="w-full md:w-3/4 h-auto"
          />
          <img
            src={leadingsmall}
            alt="Team Discussion"
            className={`absolute bottom-0 right-0 md:right-[40px] w-1/2 border-4 border-white transition-transform duration-1000 ${isVisible ? "translate-y-0" : "translate-y-full opacity-0"}`}
          />
        </div>
        <div className="w-full md:w-1/2 md:pl-10 flex flex-col justify-start mt-12 md:mt-0 md:mb-80">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">WE'RE LEADING IN THE MARKET</h2>
          <p className="text-base md:text-lg text-gray-600 mb-6">We have 35+ years of experience. We offer marketing and consulting services.</p>
          <div className="mb-4">
            <p className="text-base md:text-lg font-semibold text-blue-600">CONSULTING</p>
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div className="bg-blue-600 h-5 rounded-full text-right pr-2 text-white transition-all duration-1000" style={{ width: `${isVisible ? consultingProgress : 0}%` }}>{consultingProgress}%</div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-base md:text-lg font-semibold text-blue-600">ADVICES</p>
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div className="bg-blue-600 h-5 rounded-full text-right pr-2 text-white transition-all duration-1000" style={{ width: `${isVisible ? advicesProgress : 0}%` }}>{advicesProgress}%</div>
            </div>
          </div>
          <div className="flex items-center mt-6">
            <div className="bg-blue-600 p-3 rounded-full text-white">
              <i className="fas fa-phone"></i>
            </div>
            <p className="text-lg md:text-xl font-bold text-black ml-4">+1 7382624522</p>
          </div>
        </div>
      </section>

      <section ref={servicesRef} className="w-full py-10 md:py-16 bg-gray-100 flex justify-center items-center">
        <div className={`max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-6 transition-transform duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
          {/* Card 1 */}
          <div className="bg-white shadow-lg p-6 md:p-8 text-center">
            <div className="text-blue-500 text-3xl md:text-4xl font-bold bg-blue-100 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto">
              01
            </div>
            <h3 className="text-lg font-bold mt-4">GET PROFESSIONAL ADVICE</h3>
            <p className="text-gray-600 mt-2">
              Need expert guidance? Our mentors are here to provide personalized
              advice to help you overcome challenges and achieve your learning goals.
              Get tailored solutions, career insights, and study tips—just for you!
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-lg p-6 md:p-8 text-center">
            <div className="text-blue-500 text-3xl md:text-4xl font-bold bg-blue-100 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto">
              02
            </div>
            <h3 className="text-lg font-bold mt-4">TRUSTED & PROFESSIONAL</h3>
            <p className="text-gray-600 mt-2">
              Learn with confidence from industry experts! Our courses are created
              and delivered by trusted professionals with real-world experience.
              Get high-quality, reliable, and up-to-date knowledge to accelerate
              your success.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <div className="max-w-7xl mx-auto text-center py-8 md:py-12 mt-6 md:mt-10 px-4">
        <h2 className="text-3xl md:text-5xl font-bold">NEW CASE STUDIES</h2>
        <p className="text-gray-600 mt-2 mb-6 md:mb-8">
          We help our clients renew their business
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              className="relative group overflow-hidden rounded-lg shadow-lg h-64 md:h-80"
            >
              {/* Background Image */}
              <img
                src={study.image}
                alt={study.title}
                className="w-full h-full object-cover"
              />

              {/* Left-Bottom Content (Icon + Text) */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-3 z-10">
                <img src={study.icon} alt="icon" className="w-16 h-16 md:w-20 md:h-20" />
                <h3 className="text-white font-bold text-base md:text-lg">{study.title}</h3>
              </div>

              {/* Small Blue Hover Box from the Left */}
              <div className="absolute bottom-0 left-0 h-40 w-40 md:h-52 md:w-52 bg-blue-600 text-white flex items-center justify-center transform -translate-x-full opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                <p className="text-sm md:text-base p-2 text-center">{study.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full h-64 sm:h-80 md:h-96 mb-24 md:mb-64">
        {/* Background Image with Blue Overlay */}
        <div
          className="absolute inset-0 bg-blue-900"
          style={{
            backgroundImage: `url(${missionbackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Content (Text + Button) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4">Mission is to Protect your Businesses & Much More</h1>
          <p className="text-base md:text-lg mb-4 md:mb-6 max-w-2xl">
            Our mission is to safeguard your business with expert guidance and innovative solutions. We ensure trust, security, and growth for a thriving future
          </p>
          <button className="px-4 py-2 md:px-6 md:py-3 bg-white text-blue-700 font-semibold hover:bg-gray-200 transition">
            DISCOVER MORE
          </button>
        </div>
      </div>

      <div>
        <Stats />
      </div>
    </div>
  );
};

export default HomePage;