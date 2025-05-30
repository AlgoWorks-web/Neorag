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
import UserDashboard from "./Components/UserDashboard/UserDashboard";
import AboutUs from "./Components/AboutUs";
import Pricing from "./Components/Pricing";
import Casestudies from "./Components/Casestudies";
import Business from "./Components/Business";
import AppointmentForm from "./Components/AppointmentForm";
import Termstouse from "./Components/Termstouse";
import Sla from "./Components/Sla";
import Privacypolicy from "./Components/Privacypolicy";
import Useragreement from "./Components/UserDashboard/Useragreement";
import ForgotPassword from "./Components/ForgotPassword";
import Settings from "./Components/UserDashboard/Settings";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Admin Components
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminHome from "./Components/Admin/AdminHome";
import AdminUsers from "./Components/Admin/AdminUsers";
import AdminCourses from "./Components/Admin/AdminCourses";
import AdminPlans from "./Components/Admin/AdminPlans";
import AdminSettings from "./Components/Admin/AdminSettings";
import AdminReports from "./Components/Admin/AdminReports";

const AppContent = () => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname.startsWith("/user-dashboard") ||
    location.pathname.startsWith("/admin");

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
        <Route path="/about" element={<AboutUs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/case-studies" element={<Casestudies />} />
        <Route path="/business" element={<Business />} />
        <Route path="/terms" element={<Termstouse />} />
        <Route path="/sla" element={<Sla />} />
        <Route path="/privacy" element={<Privacypolicy />} />
        <Route path="/useragreement" element={<Useragreement />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/book-appointment" element={<AppointmentForm />} />


        {/* User Dashboard Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />}>
          <Route path="home" element={<Myhome />} />
          <Route path="courses" element={<Courses />} />
          <Route path="mycourse" element={<MyCourses />} />
          <Route path="pricing" element={<Pricing minimal={true} />} />
          <Route path="Settings" element={<Settings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-home" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reports" element={<AdminReports />} />
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
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;