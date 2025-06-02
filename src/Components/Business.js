import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { 
  faLaptop,
  faMobileScreen,
  faPaintBrush,
  faServer,
  faLightbulb,
  faHandshake,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

const Business = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate('/book-appointment');
  };

  return (
    <div className="bg-backcolor py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <div className="mb-15">
            <div className="flex justify-center items-center mb-8">
            <div className="h-3 w-3 border-l-2 border-t-2 border-customBlue"></div>
            <button 
            onClick={handleBookAppointment}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 mx-4"
            >
            Book An Appointment
            </button>
            <div className="h-3 w-3 border-b-2 border-r-2 border-customBlue"></div>
            </div>
        </div>

        {/* Core Services Section */}
        <div className="mb-10">
          <div className="flex justify-center mb-8">
            <h1 className="text-2xl text-customBlue">Our IT Business Services</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: faLaptop,
                color: "text-blue-500",
                title: "Web Solutions",
                description: "Website Design & Development, Web Application Development, Maintenance, Redevelopment, E-Commerce Platform Development"
              },
              {
                icon: faMobileScreen,
                color: "text-green-500",
                title: "Mobility Solutions",
                description: "Mobile Application Development, Enterprise Application Development, M-Commerce & e-Wallets"
              },
              {
                icon: faChartLine,
                color: "text-purple-500",
                title: "Digital Solutions",
                description: "Digital Marketing, Search Engine Optimizations"
              },
              {
                icon: faPaintBrush,
                color: "text-pink-500",
                title: "Branding & Creative",
                description: "Creative Logo Design, Brand Identity Development"
              },
              {
                icon: faServer,
                color: "text-orange-500",
                title: "Hosting Solutions",
                description: "Application & Web Hosting, Corporate Email Hosting, Public/Private Cloud Hosting, Domain Name Registration"
              },
              {
                icon: faLightbulb,
                color: "text-yellow-500",
                title: "Start-Up Consulting",
                description: "Product Ideation, Product Branding, Product Development, Product Marketing"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 text-center shadow-sm rounded-xl border border-gray-200 bg-gradient-to-br hover:from-green-100 hover:via-lightblue-500 hover:to-pink-300">
                <FontAwesomeIcon 
                  icon={service.icon} 
                  className={`${service.color} text-4xl mb-4`} 
                />
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Driving Digital Transformation</h2>
              <p className="text-lg mb-6">
                NeoRAG is a leading technology solutions provider dedicated to helping businesses 
                navigate the digital landscape. With our expertise in cutting-edge technologies 
                and innovative approaches, we deliver solutions that drive growth and efficiency.
              </p>
              <p className="text-lg">
                Founded in 2015, we've grown from a small startup to a trusted partner for 
                enterprises across multiple industries, delivering measurable results through 
                our comprehensive service offerings.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Business Team" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>


        {/* Business Approach Section */}
        <div>
          <div className="flex justify-center mb-8">
            <h1 className="h-4 w-4 border-l-4 border-t-4 border-customBlue"></h1>
            <h1 className="text-4xl text-customBlue">Our Approach</h1>
            <h1 className="mt-7 h-4 w-4 border-b-4 border-r-4 border-customBlue"></h1>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: faHandshake,
                title: "Client-Centric",
                description: "We prioritize understanding your unique business needs and goals to deliver tailored solutions."
              },
              {
                icon: faLightbulb,
                title: "Innovation Focused",
                description: "Leveraging the latest technologies to give you a competitive advantage in your market."
              },
              {
                icon: faChartLine,
                title: "Results-Oriented",
                description: "We measure our success by the tangible business outcomes we deliver for our clients."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className="text-customBlue text-3xl mb-3" 
                />
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;