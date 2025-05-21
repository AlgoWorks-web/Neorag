import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../Assets/Neoraglogo.png";
import { Link } from "react-router-dom";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const Footer = () => {
    return (
        <footer className="bg-white text-gray-800 py-10 px-6 md:px-20 border-t">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                
                {/* Company Info */}
                <div className="flex flex-col space-y-4">
                    <img
                        src={logo}
                        alt="Neorag Consultancy Logo"
                        className="w-40 h-40 md:w-56 md:h-56 object-contain"
                    />
                    <p className="text-gray-500 text-sm">Welcome to our consultancy.</p>
                    <div className="border-b w-full" />
                    <div className="space-y-2 text-sm font-medium text-blue-900">
                        <p className="flex items-center space-x-2">
                            <span>📞</span>
                            <span>+1 73826 24522</span>
                        </p>
                        <p className="flex items-center space-x-2">
                            <span>📧</span>
                            <span>corporate@neorag.com</span>
                        </p>
                        <p className="flex items-start space-x-2">
                            <span>📍</span>
                            <span>13208 Spinning Glen St, Euless, TX 76040</span>
                        </p>
                    </div>
                </div>

                {/* Explore */}
                <div>
                    <h2 className="font-bold text-xl text-gray-800 mb-4">Explore</h2>
                    <ul className="space-y-2 text-blue-900 font-semibold">
                        {[
                            { name: "Home", to: "/" },
                            { name: "About Us", to: "/about" },
                            { name: "Services", to: "/services" },
                            { name: "Case Studies", to: "/case-studies" },
                            { name: "Pricing", to: "/pricing" },
                            { name: "Contact", to: "/contact" },
                        ].map(({ name, to }) => (
                            <li key={to}>
                                <Link to={to} onClick={scrollToTop} className="hover:underline">
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Policies */}
                <div>
                    <h2 className="font-bold text-xl text-gray-800 mb-4">Support</h2>
                    <ul className="space-y-2 text-blue-900 font-semibold">
                        {[
                            { name: "Support", to: "/" },
                            { name: "Terms of Use", to: "/terms" },
                            { name: "Service Level Agreement (SLA)", to: "/sla" },
                            { name: "Privacy Policy", to: "/privacy" },
                            { name: "Help", to: "/contact" },
                        ].map(({ name, to }) => (
                            <li key={to}>
                                <Link to={to} onClick={scrollToTop} className="hover:underline">
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h2 className="font-bold text-xl text-gray-800 mb-4">Newsletter</h2>
                    <div className="bg-blue-50 p-6 rounded-lg shadow-sm max-w-sm">
                        <p className="text-sm font-medium text-black mb-4">Subscribe to our newsletter</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md text-gray-700 text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-gray-700 text-white px-4 py-2 rounded-r-md text-sm font-semibold"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="container mx-auto mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                <p>© 2025 Neorag Solutions LLC. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" aria-label="Facebook" className="bg-blue-800 p-2 rounded-full text-white"><FaFacebookF /></a>
                    <a href="#" aria-label="LinkedIn" className="bg-blue-600 p-2 rounded-full text-white"><FaLinkedinIn /></a>
                    <a href="#" aria-label="Twitter" className="bg-blue-400 p-2 rounded-full text-white"><FaTwitter /></a>
                    <a href="#" aria-label="Instagram" className="bg-black p-2 rounded-full text-white"><FaInstagram /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
