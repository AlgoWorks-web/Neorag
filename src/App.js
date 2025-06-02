import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Main website components
import HomePage from './Components/HomePage';
import Services from './Components/Services';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ContactUs from './Components/Contact';
import AboutUs from './Components/AboutUs';
import Pricing from './Components/Pricing';
import Casestudies from './Components/Casestudies';
import Business from './Components/Business';
import AppointmentForm from './Components/AppointmentForm';
import Termstouse from './Components/Termstouse';
import Sla from './Components/Sla';
import PrivacyPolicy from './Components/Privacypolicy';
import Useragreement from "./Components/UserDashboard/Useragreement";
import ForgotPassword from "./Components/ForgotPassword";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// User Dashboard components
import UserDashboard from "./Components/UserDashboard/UserDashboard";
import Myhome from "./Components/UserDashboard/Myhome";
import Courses from "./Components/UserDashboard/Courses";
import MyCourses from "./Components/UserDashboard/MyCourses";
import Settings from "./Components/UserDashboard/Settings";

// Admin components
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminHome from "./Components/Admin/AdminHome";
import AdminUsers from "./Components/Admin/AdminUsers";
import AdminCourses from "./Components/Admin/AdminCourses";
import AdminPlans from "./Components/Admin/AdminPlans";
import AdminSettings from "./Components/Admin/AdminSettings";
import AdminReports from "./Components/Admin/AdminReports";

// Trainer components
import TrainerDashboard from "./pages/TrainerDashboard"; // Main dashboard layout
import TrainerLogin from "./pages/TrainerLogin";
import TrainerHome from "./Components/Trainer/TrainerHome"; // Updated path
import TrainerProfile from "./Components/Trainer/TrainerProfile"; // Updated path
import TrainingInfo from "./Components/Trainer/TrainingInfo"; // Updated path
import TrainingMaterials from "./Components/Trainer/TrainingMaterials"; // Updated path
import VideoUploader from "./Components/Trainer/VideoUploader"; // Updated path

//Student
import StudentDashboard from "./pages/StudentDashboard";
import StudentLogin from "./pages/StudentLogin";
import StudentHome from "./Components/Student/StudentHome";
import StudentCourses from "./Components/Student/StudentCourses";
import CourseDetail from "./Components/Student/CourseDetail";
import MaterialsList from "./Components/Student/MaterialsList";
import VideoLectures from "./Components/Student/VideoLectures";
import ScheduleView from "./Components/Student/ScheduleView";

const AppContent = () => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname.startsWith("/user-dashboard") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/trainer") ||
    location.pathname.startsWith("/student");

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
        <Route path="/privacy" element={<PrivacyPolicy />} />
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

        {/* Trainer Routes - Updated to match your component structure */}
        <Route path="/trainer-login" element={<TrainerLogin />} />
        <Route path="/trainer" element={<TrainerDashboard />}>
          <Route index element={<TrainerHome />} />
          <Route path="training-info" element={<TrainingInfo />} />
          <Route path="materials" element={<TrainingMaterials />} />
          <Route path="videos" element={<VideoUploader />} />
          <Route path="profile" element={<TrainerProfile />} />
          <Route path="settings" element={<Settings />} /> {/* Use existing Settings component */}
        </Route>
        

        {/* Student Routes */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student" element={<StudentDashboard />}>
          <Route index element={<StudentHome />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="course/:courseId" element={<CourseDetail />} />
          <Route path="materials" element={<MaterialsList />} />
          <Route path="videos" element={<VideoLectures />} />
          <Route path="schedule" element={<ScheduleView />} />
        </Route>

      </Routes>

      {!hideNavAndFooter && (
        <>
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