import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import cases from "../Assets/cases.png";
import case1 from "../Assets/case1.jpg";
import icon1 from "../Assets/icon1.jpg";
import read from "../Assets/read.png";
import mission from "../Assets/mission.png";
import case2 from "../Assets/case2.jpg";
import case3 from "../Assets/case3.jpg";
import case4 from "../Assets/case4.jpg";
import icon2 from "../Assets/icon2.jpg";
import icon3 from "../Assets/icon3.jpg";
import icon4 from "../Assets/icon4.jpg";
import footer from "../Assets/footer.png";

const caseStudies = [
  {
    title: "FINANCIAL CONSULTANT",
    description:
      "Markets dominated by products and services designed for the general consumer.",
    icon: icon2,
    image: case2,
    reverse: false,
    bg: null,
  },
  {
    title: "BUSINESS CONSULTANCY",
    description:
      "Business Insurance serves business executives who are responsible for the purchase and administration.",
    icon: icon3,
    image: case3,
    reverse: true,
    bg: read,
  },
  {
    title: "INSURANCE CONSULTANCY",
    description:
      "We go deep to unlock insight and have the courage to act. We bring the right people together to challenge.",
    icon: icon4,
    image: case4,
    reverse: false,
    bg: null,
  },
];

export default function Casestudies() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full px-4 space-y-16">
      {/* Header */}
      <section className="w-full text-center space-y-6">
  <div className="relative w-full flex justify-center">
    <img
      src={cases}
      alt="Banner"
      className="w-full h-96 object-cover z-0"
    />
    <div className="absolute top-0 left-0 w-full h-96 bg-gray-900 opacity-60 z-10" />
    <motion.h1
      initial={{ y: 40, opacity: 0 }} // reduced motion
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }} // slightly quicker and smoother
      className="absolute top-1/2 transform -translate-x-1/2 -translate-y-[30%] text-7xl font-bold text-white drop-shadow-lg z-20"
    >
      CASE STUDIES
    </motion.h1>
  </div>
</section>


      {/* Intro Section */}
      <section className="w-full px-4 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <motion.h2
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl font-bold"
            >
              OUR SUCCESSFUL CASE STUDY
            </motion.h2>
            <p className="mt-4">
              Our Successful Case Studies showcase real-world results achieved
              through our expertise and dedication.
            </p>
            <p>
              We have helped businesses overcome challenges with innovative
              strategies and data-driven solutions. Each case study highlights
              our commitment to delivering measurable success and long-term
              growth. Explore our success stories and see how Neorag transforms
              challenges into opportunities!
            </p>
          </div>
          <div className="relative flex-1 flex justify-center items-center">
            <img
              src={case1}
              alt="Case Study Main"
              className="w-full shadow-md"
            />
            <motion.img
              src={icon1}
              alt="Case Study Icon"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute -left-10 top-6 w-20 h-30 md:w-30 md:h-20 z-20 shadow-xl transition-transform duration-500 ease-in-out hover:scale-110"
            />
          </div>
        </div>
      </section>

      {/* Expert Areas */}
      <section
        className="w-full text-center space-y-8 py-16 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${read})` }}
      >
        <div className="relative z-10 px-4">
          <h2 className="text-3xl font-bold mt-10 text-black">
            WE ARE EXPERT IN THESE CASES
          </h2>
          <p className="mb-4 text-black">
            WE HELP YOU TO ENSURE EVERYONE IS IN THE RIGHT JOB
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mt-14 mx-auto">
            {[
              ["STRATEGY", "A business strategy is the means by which it sets out to achieve its desired ends."],
              ["TAXES", "Company income subject to tax is often determined much like taxable income."],
              ["MARKETS", "Markets dominated by products and services designed for the general consumer."],
              ["INSURANCE", "Business Insurance serves business executives who are responsible for the purchase."],
              ["AUDIT", "If you have been selected for a business audit, here is what you need to know."],
              ["RESTRUCTURING", "Restructuring your company could restore its viability and improve its liquidity."],
              ["FINANCIAL", "Financial services are the economic services provided by the finance industry."],
              ["COMMUNICATIONS", "Business communication involves constant flow of information."]
            ].map(([title, desc], index) => (
              <div
                key={index}
                className="p-6 border bg-white bg-opacity-90 hover:shadow transition flex flex-col justify-between min-h-[230px]"
              >
                <div>
                  <h5 className="text-xl font-bold mb-3">{title}</h5>
                  <p className="text-base mb-6">{desc}</p>
                </div>
                <a
                  href="#"
                  className="group relative inline-block text-blue-600 font-semibold"
                >
                  READ MORE
                  <span className="block h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full mt-1"></span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

 {/* Mission Section */}
<section
  className="w-full text-center h-[500px] px-4 py-16 bg-cover bg-center bg-no-repeat relative"
  style={{ backgroundImage: `url(${mission})` }}
>
  <div className="absolute inset-0 bg-gray-900 opacity-40 z-0"></div>

  <div className="relative z-10 flex flex-col justify-center items-center h-full">
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">
        Mission is to Protect your Businesses & Much More
      </h2>
      <p className="max-w-2xl mx-auto font-semibold text-white">
        Our mission is to safeguard your business with expert guidance and
        innovative solutions. We ensure trust, security, and growth for a
        thriving future.
      </p>
    </div>

    <motion.a
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      href="#"
      className="inline-flex items-center justify-center mt-10 h-16 w-64 bg-white text-blue-600 font-semibold shadow transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105"
    >
      DISCOVER MORE
    </motion.a>
  </div>
</section>

      {/* Case Study Cards */}
      {caseStudies.map((item, index) => (
        <section
          key={index}
          className={`w-full ${item.bg ? "bg-cover bg-center bg-no-repeat" : ""}`}
          style={item.bg ? { backgroundImage: `url(${item.bg})` } : {}}
        >
          <div
            className={`max-w-7xl mx-auto flex flex-col md:flex-row ${
              item.reverse ? "md:flex-row-reverse" : ""
            } items-center gap-8 relative py-12 px-4`}
          >
            <div className="flex-1 text-left space-y-4">
              <h2 className="text-2xl font-bold">{item.title}</h2>
              <p className="text-base text-gray-700">{item.description}</p>
              <a
                href="#"
                className="group relative inline-block text-blue-600 font-semibold"
              >
                READ MORE
                <span className="block h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full mt-1"></span>
              </a>
            </div>
            <div className="flex-1 relative max-w-md mx-auto">
              <img
                src={item.image}
                alt="Case"
                className="w-full shadow-md object-cover h-[400px]"
              />
              <img
                src={item.icon}
                alt="Icon"
                className="absolute -left-10 top-6 w-20 h-20 z-20 shadow-xl transition-all duration-300 hover:scale-110"
              />
            </div>
          </div>
        </section>
      ))}

      {/* Footer Call to Action */}
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
}
