import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../Assets/Solutionsllc.png";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-white text-gray-800 py-10 px-6 md:px-20 border-t">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="flex flex-col space-y-4">
                    <img
                        src={logo}
                        alt="Neorag Consultancy"
                        className="w-52 h-52"
                    />
                    <p className="text-gray-500">Welcome to our consultancy.</p>
                    <div className="border-b w-full" />
                    <div className="space-y-2 font-semibold">
                    <p className="flex items-center space-x-2 text-blue-900">
                    <span>📞</span>
                    <span>+1 73826 24522</span>
                   </p>
                   <p className="flex items-center space-x-2 text-blue-900">
                    <span>📧</span>
                    <span>corporate@neorag.com</span>
                   </p>
                    <p className="flex items-start space-x-2 text-blue-900">
                    <span>📍</span>
                     <span>13208 SPINNING GLEN ST EULESS, TX 76040</span>
                    </p>
                </div>

                </div>

                {/* Explore */}
                <div>
                    <h2 className="font-bold text-gray-800 text-2xl">EXPLORE</h2>
                    <ul className="space-y-2 mt-2 font-semibold">
                        <li><Link to="/" className="text-blue-900 hover:underline">Home</Link></li>
                        <li><Link to="/about" className="text-blue-900 hover:underline">About Us</Link></li>
                        <li><Link to="/services" className="text-blue-900 hover:underline">Services</Link></li>
                        <li><Link to="/case-studies" className="text-blue-900 hover:underline">Case Studies</Link></li>
                        <li><Link to="/pricing" className="text-blue-900 hover:underline">Pricing</Link></li>
                        <li><Link to="/contact" className="text-blue-900 hover:underline">Contact</Link></li> 
                        
                    </ul>
                </div>

                <div>
                    <ul className="space-y-2 mt-8 font-semibold">
                        <li><Link to="/" className="text-blue-900 hover:underline">Support</Link></li>
                        <li><Link to="/terms" className="text-blue-900 hover:underline">Terms of use</Link></li>
                        <li><Link to="/sla" className="text-blue-900 hover:underline">Service Level Agreement (SLA)</Link></li>
                        <li><Link to="/privacy" className="text-blue-900 hover:underline">Privacy policy</Link></li>
                        <li><Link to="/contact" className="text-blue-900 hover:underline">Help</Link></li>



                    </ul>
                </div>

                {/* Newsletter */}
                <div className=" p-2 w-80 justify-start">
                    <h2 className="font-bold text-gray-800 text-2xl">NEWSLETTER</h2>
                    <div className="bg-blue-50 h-48 w-96 p-10 mr-12 md:mr-8 mt-4">
                    <p className="text-sm  text-black font-semibold ">Subscribe for Newsletter</p>
                    <div className="mt-4 flex">
                    <div className="mt-4 flex">
                <input
                     type="email"
                     placeholder="Email address"
                     className="flex-grow p-2 border text-gray-700"
                />
                <button className="bg-gray-700 text-white px-4 py-2 -ml-12">
                     REGISTER
                </button>
                </div>

                    </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-8 border-t pt-6 text-sm text-gray-600">
                <p>© 2024 Neorag Consulting Inc. All Rights Reserved</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" className="bg-blue-800 p-2 rounded-full text-white"><FaFacebookF /></a>
                    <a href="#" className="bg-blue-600 p-2 rounded-full text-white"><FaLinkedinIn /></a>
                    <a href="#" className="bg-blue-400 p-2 rounded-full text-white"><FaTwitter /></a>
                    <a href="#" className="bg-black p-2 rounded-full text-white"><FaInstagram /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;