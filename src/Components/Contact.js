import { useState, useEffect } from "react";
import contact from "../Assets/contact.png";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import call from "../Assets/call.png";
import email from "../Assets/email.jpg";
import address from "../Assets/address.jpg";
import Getintouch from "./Getintouch";




const ContactUs = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        const textElement = document.querySelector("#contact-text");
        if (textElement) observer.observe(textElement);

        return () => {
            if (textElement) observer.unobserve(textElement);
        };
    }, []);

    return (
        <div>
            <div className="relative w-full h-[350px]">
                {/* Background Image */}
                <img
                    src={contact} // Update with correct path
                    alt="Contact Us"
                    className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h1
                        id="contact-text"
                        className={`text-white text-5xl  font-bold transition-transform duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                            }`}
                    >
                        CONTACT US
                    </h1>
                </div>
            </div>
            <div>
                <section className="py-10 px-5 bg-white">
                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold">REACH OUT</h2>
                        <p className="text-gray-600">We help our clients renew their business</p>
                    </div>

                    {/* Cards Container */}
                    <div className="grid md:grid-cols-3 gap-6 ">

                        {/* Call Card */}
                        <div className="relative group">
                            <img
                                src={call}  // Replace with actual path
                                alt="Call Support"
                                className="w-96 h-96 object-cover "
                            />
                            <div className="absolute bottom-0 left-0 w-42 bg-blue-600 text-white p-5 rounded-b-lg">
                                <FaPhoneAlt size={30} />
                                <h3 className="text-lg font-semibold mt-2">CALL 24/7</h3>
                                <a href="tel:+17382624522" className="text-lg font-bold hover:underline">
                                    +1 73826 24522
                                </a>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="relative group">
                            <img
                                src={email}  // Replace with actual path
                                alt="Write Us"
                                className="w-96 h-96 object-cover rounded-lg"
                            />
                            <div className="absolute bottom-0 left-0 w-42 bg-blue-600 text-white p-5 rounded-b-lg">
                                <MdEmail size={30} />
                                <h3 className="text-lg font-semibold mt-2">WRITE US</h3>
                                <a href="mailto:corporate@neorag.com" className="text-lg font-bold hover:underline">
                                    corporate@neorag.com
                                </a>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="relative group">
                            <img
                                src={address} // Replace with actual path
                                alt="Our Location"
                                className="w-96 h-96 object-cover rounded-lg"
                            />
                            <div className="absolute bottom-0 left-0 w-42 bg-blue-600 text-white p-5 rounded-b-lg">
                                <FaMapMarkerAlt size={25} />
                                <h3 className="text-sm font-semibold mt-2">REACH US</h3>
                                <p className="text-md font-bold">13208 Spinning Glen St</p>
                                <p className="text-md font-bold">Euless, Texas</p>
                            </div>
                        </div>

                    </div>
                </section>
                <Getintouch />
<<<<<<< HEAD
                {/* <Map />  */ }
                
=======
                {/* <Map /> */}
>>>>>>> d7ac929 (Your commit message here)

            </div>
        </div>
    );
};

export default ContactUs;