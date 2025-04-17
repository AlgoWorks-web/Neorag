import React, { useEffect, useState } from "react";
import Service from "../Assets/Service.png";
import Icon5 from "../Assets/icon5.png";
import Icon6 from "../Assets/icon6.png";
import Read from "../Assets/read.png";
import Icon7 from "../Assets/icon7.jpg";
import icon8 from "../Assets/icon8.jpg";
import hr1 from "../Assets/hr1.jpg";
import hr2 from "../Assets/hr2.jpg";
import hr3 from "../Assets/hr3.jpg";
import read from "../Assets/read.png";
import footer from "../Assets/footer.png";
import Stats from "./Stats";

const ServicesPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="px-4  space-y-16 bg-white  text-gray-800">
      {/* HERO SECTION */}
      <section
        className="relative w-full h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${Service})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <h1
          className={`text-6xl font-bold mt-10 text-white z-20 drop-shadow-lg transition-all duration-700 ease-in-out transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          SERVICES
        </h1>
      </section>

      {/* SERVICES SECTION */}
      <section
        className="w-full bg-cover bg-center bg-no-repeat py-16"
        style={{ backgroundImage: `url(${Read})` }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-black">SERVICES</h1>
          <p className="text-lg text-black/90">
            The best business consulting firm you can count on!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 px-4">
          {[
            {
              title: "Independent Research",
              desc: "Our Independent Research delivers data-driven insights and strategic analysis to support informed decision-making.",
              button: "LEARN MORE",
              icon: Icon5,
            },
            {
              title: "Consulting",
              desc: "Our Consulting services provide expert guidance and strategic solutions to drive business growth and success.",
              button: "EXPLORE SOLUTIONS",
              icon: Icon5,
            },
            {
              title: "Marketing Services",
              desc: "Our Marketing Services help businesses grow with strategic campaigns, brand positioning, and data-driven insights.",
              button: "FIND TALENT",
              icon: Icon6,
            },
          ].map((item, i) => {
            let baseTranslate = "";
            if (i === 0) baseTranslate = "-translate-x-12";
            else if (i === 1) baseTranslate = "translate-y-10";
            else if (i === 2) baseTranslate = "translate-x-12";

            return (
              <div
                key={i}
                className={`group bg-white border border-gray-900 rounded-[32px] p-6 shadow-sm flex flex-col justify-between max-w-sm w-full transition-all duration-700 ease-in-out transform ${
                  isVisible
                    ? "opacity-100 translate-x-0 translate-y-0"
                    : `${baseTranslate} opacity-0`
                } hover:shadow-lg hover:-translate-y-1`}
              >
                <div>
                  <h5 className="text-lg font-bold mb-2 group-hover:text-blue-600">{item.title}</h5>
                  <p className="text-gray-700 mb-6 group-hover:text-gray-900">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <a
                    href="#"
                    className="bg-blue-600 text-white px-4 py-3 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out group-hover:bg-blue-700 group-hover:scale-105"
                  >
                    {item.button}
                  </a>
                  <img
                    src={item.icon}
                    alt={`${item.title} Icon`}
                    className="w-12 h-12 object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="text-center mb-16">
        <h2 className="text-4xl font-bold">WHAT WE DO</h2>
        <p className="text-xl font-semibold text-gray-700">
          WE HELP YOU TO ENSURE EVERYONE IS IN THE RIGHT JOBS
        </p>
      </section>

      {/* INDEPENDENT RESEARCH SECTION */}
      <section className="grid md:grid-cols-2 gap-10 items-center mb-20 px-4">
        <div
          className={`space-y-6 transform transition-all duration-1000 ease-in-out ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
        >
          <h2 className="text-5xl font-bold">INDEPENDENT RESEARCH</h2>
          <p className="text-gray-700 text-base">
            Markets dominated by products and services designed for the general consumer.
          </p>
          <div className="mt-6">
            <a
              href="#"
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold text-sm shadow hover:bg-blue-700 transition ease-in-out duration-300"
            >
              REQUEST A CUSTOM REPORT
            </a>
          </div>
        </div>
        <div className="relative w-full max-w-xl mx-auto">
          <img
            src={Icon7}
            alt="Icon Overlay"
            className={`absolute -left-10 top-10 w-24 h-24 z-20 shadow-xl transition-all duration-1000 ease-in-out transform ${
              isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
            } hover:scale-110 active:scale-95 cursor-pointer`}
          />
          <img src={hr1} alt="Independent Research" className="w-full shadow-md" />
        </div>
      </section>

      {/* CONSULTING SECTION */}
      <section
        className="w-full bg-cover bg-center bg-no-repeat px-4 py-16"
        style={{ backgroundImage: `url(${read})` }}
      >
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
          <div className="relative w-full max-w-xl mx-auto">
            <img src={hr2} alt="Consulting" className="w-full shadow-md" />
            <img
              src={Icon7}
              alt="Icon Overlay"
              className={`absolute right-[-30px] top-[40px] w-24 h-24 z-20 shadow-xl transition-all duration-1000 ease-in-out transform ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
              } hover:scale-110 active:scale-95 cursor-pointer`}
            />
          </div>
          <div
            className={`space-y-4 transition-all duration-1000 ease-in-out transform ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            <h2 className="text-5xl font-bold">CONSULTING</h2>
            <p className="text-gray-700 text-base">
              Business Insurance serves business executives who are responsible for the purchase and administration.
            </p>
            <div
              className={`pt-4 transition-all duration-1000 ease-in-out transform delay-150 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
            >
              <a
                href="#"
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold text-sm shadow transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105"
              >
                START YOUR STRATEGIC CONSULTATION
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING LINK */}
      <div className="text-center py-10">
        <h2 className="text-5xl font-semibold">
          <a
            href="#"
            className="text-blue-600 underline hover:text-blue-700 transition-colors duration-300"
          >
            PRICING PLANS
          </a>
        </h2>
      </div>

      {/* MARKETING SERVICES SECTION */}
      <section className="grid md:grid-cols-2 gap-10 items-center my-20 px-4">
        <div
          className={`space-y-4 transform transition-all duration-1000 ease-in-out ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
        >
          <h2 className="text-5xl font-bold">MARKETING SERVICES</h2>
          <p className="text-gray-700 text-base">
            We go deep to unlock insight and have the courage to act. We bring the right people together to challenge.
          </p>
          <div
            className={`pt-4 transition-all duration-1000 ease-in-out transform delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <a
              href="#"
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold text-sm shadow transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105"
            >
              FIND YOUR TALENT TODAY
            </a>
          </div>
        </div>
        <div className="relative w-full max-w-xl mx-auto">
          <img
            src={icon8}
            alt="Icon Overlay"
            className={`absolute -left-10 top-6 w-24 h-24 z-20 shadow-xl transition-all duration-1000 ease-in-out transform ${
              isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
            } hover:scale-110 cursor-pointer`}
          />
          <img src={hr3} alt="Marketing Services" className="w-full shadow-md" />
        </div>
      </section>

      {/* STATS */}
      <div>
        <Stats />
      </div>

      {/* FOOTER CTA */}
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

export default ServicesPage;
