import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import HomePage from './Components/Home';
import Services from './Components/Services';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Tooltip from './Components/Tooltip';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ContactUs from './Components/Contact';
import Myhome from "./Components/UserDashboard/Myhome";
import Courses from "./Components/UserDashboard/Courses";
import MyCourses from "./Components/UserDashboard/MyCourses";
import Agreement from "./Components/UserDashboard/Agreement";
import UserDashboard from "./Components/UserDashboard";
import AboutUs from "./Components/AboutUs";
import Pricing from "./Components/Pricing";
import Casestudies from "./Components/Casestudies";
import Termstouse from "./Components/Termstouse";
import Sla from "./Components/Sla";
import Privacypolicy from "./Components/Privacypolicy";



const AppContent = () => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname.startsWith("/user-dashboard");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {!hideNavAndFooter && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/case-studies" element={<Casestudies/>}/>
        <Route path="/terms" element={<Termstouse />} />
        <Route path="/sla" element={<Sla />} />
        <Route path="/privacy" element={<Privacypolicy/>} />

        {/* User Dashboard Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />}>
          <Route path="home" element={<Myhome />} />
          <Route path="courses" element={<Courses />} />
          <Route path="mycourse" element={<MyCourses />} />
          <Route path="agreement" element={<Agreement />} />
        </Route>
      </Routes>

      {!hideNavAndFooter && (
        <>
          <Tooltip text="^" onClick={scrollToTop} />
          <Footer />
        </>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
