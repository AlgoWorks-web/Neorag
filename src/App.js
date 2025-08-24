import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";


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
import Useragreement from "./Components/Student/Useragreement";
import ForgotPassword from "./Components/ForgotPassword";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// User Dashboard components
import Settings from "./Components/UserDashboard/Settings";

// Admin components
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminHome from "./Components/Admin/AdminHome";
import AdminCourses from "./Components/Admin/AdminCourses";
import AdminPlans from "./Components/Admin/AdminPlans";
import AdminSettings from "./Components/Admin/AdminSettings";
import AdminReports from "./Components/Admin/AdminReports";
import ContactInfo from "./Components/Admin/ContactInfo";
import AppointmentInfo from "./Components/Admin/AppointmentInfo";
import AdminTrainers from "./Components/Admin/AdminTrainers";
import AdminStudents from "./Components/Admin/AdminStudents";
import EnrolledStudents from "./Components/Admin/EnrolledStudents";
import Agreements from "./Components/Admin/Agreements";

// Trainer components
import TrainerDashboard from "./pages/TrainerDashboard";
import TrainerLogin from "./pages/TrainerLogin";
import TrainerHome from "./Components/Trainer/TrainerHome";
import TrainerProfile from "./Components/Trainer/TrainerProfile";
import TrainingInfo from "./Components/Trainer/TrainingInfo";
import TrainingMaterials from "./Components/Trainer/TrainingMaterials";
import VideoUploader from "./Components/Trainer/VideoUploader";

// Student
import StudentDashboard from "./pages/StudentDashboard";
import StudentLogin from "./pages/StudentLogin";
import StudentHome from "./Components/Student/StudentHome";
import CourseDetail from "./Components/Student/CourseDetail";
import MaterialsList from "./Components/Student/MaterialsList";
import VideoLectures from "./Components/Student/VideoLectures";
import ScheduleView from "./Components/Student/ScheduleView";
import StudentProfile from "./Components/Student/StudentProfile";
import Courses from "./Components/Student/Courses";
import StudentMyCourses from "./Components/Student/StudentMyCourses";
import PaymentSuccess from "./Components/PaymentSuccess";
import PricingPlans from "./Components/PricingPlans";
import AllCoursestogether from "./Components/Student/AllCoursestogether";
import PublicCourses from "./Components/PublicCourses";
import PublicCourseDetails from "./Components/PublicCourseDetails";
import PrivateRoute from '../src/auth/PrivateRoute';


// 404 component
import NotFound from './Components/NotFound';
import ChangePassword from "./Components/Trainer/ChangePassword";


function AppContent() {
  const location = useLocation();

  // Match only for your defined public routes
  const publicRoutePrefixes = [
    "/", "/services", "/contact", "/login", "/signup", "/about", "/pricing",
    "/case-studies", "/business", "/terms", "/sla", "/privacy", "/publiccourses",
    "/forgot-password", "/book-appointment", "/pricingplans", "/Allcourses",
    "/public-course-details/"
  ];

  // If on a dashboard/admin/trainer/student route OR on NotFound = hide Navbar/Footer
  const isDashboard =
    location.pathname.startsWith("/user-dashboard") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/trainer") ||
    location.pathname.startsWith("/student");

  // Detect whether to show Nav/Footer
  // Nav/Footer HIDDEN on:
  // - Dashboard, admin, trainer, student areas
  // - Login, signup, forgot-password
  // - Any 404 page (i.e. route does not match allowed public prefixes)
  const isPublicPage = publicRoutePrefixes.some(
    prefix => location.pathname === prefix || location.pathname.startsWith(prefix + "/")
  );
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname);
  const hideNavAndFooter = isDashboard || isAuthPage || !isPublicPage;

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
        <Route path="/publiccourses" element={<PublicCourses />} />
        <Route path="/public-course-details/:courseId" element={<PublicCourseDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/book-appointment" element={<AppointmentForm />} />
        <Route path="/pricingplans" element={<PricingPlans />} />
        <Route path="/Allcourses" element={<AllCoursestogether />} />

        {/* Admin Routes */}
        <Route path="/supremehandling" element={<AdminLogin />} />
        <Route path="/admin-home" element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        } >
          <Route index element={<AdminHome />} />
          <Route path="adminstudents" element={<AdminStudents />} />
          <Route path="adminstrainers" element={<AdminTrainers />} />
          <Route path="Admincourses" element={<AdminCourses />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="students-enrolled" element={<EnrolledStudents />} />
          <Route path="agreements" element={<Agreements />} />
          <Route path="contactinfo" element={<ContactInfo />} />
          <Route path="appointmentinfo" element={<AppointmentInfo />} />
        </Route>

        {/* Trainer Routes */}
        <Route path="/trainer-login" element={<TrainerLogin />} />
        <Route path="/trainer" element={
          <PrivateRoute role="trainer">
            <TrainerDashboard />
          </PrivateRoute>
        } >
          <Route index element={<TrainerHome />} />
          <Route path="training-info" element={<TrainingInfo />} />
          <Route path="materials" element={<TrainingMaterials />} />
          <Route path="videos" element={<VideoUploader />} />
          <Route path="profile" element={<TrainerProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="changepassword" element={<ChangePassword/>}/>
        </Route>

        {/* Student Routes */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student" element={
          <PrivateRoute role="student">
            <StudentDashboard />
          </PrivateRoute>
        } >
          <Route index element={<StudentHome />} />
          <Route path="courses" element={<PricingPlans />} />
          <Route path="mycourses" element={<StudentMyCourses />} />
          <Route path="materials" element={<MaterialsList />} />
          <Route path="videos" element={<VideoLectures />} />
          <Route path="schedule" element={<ScheduleView />} />
          <Route path="studentprofile" element={<StudentProfile />} />
          <Route path="course-details/:courseId" element={<CourseDetail />} />
          <Route path="useragreement/:courseId" element={<Useragreement />} />
        

          

        </Route>
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* CATCH-ALL 404 ROUTE --- always LAST */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideNavAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}
export default App;
