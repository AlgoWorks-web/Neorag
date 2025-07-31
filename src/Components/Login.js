import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const response = await axios.post("https://hydersoft.com/api/student/resend-verification", {
        email: formData.email,
      });

      setMessage("✅ Verification email sent! Please check your inbox.");
      setIsSuccess(true);
      setShowResendButton(false);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to resend verification email.");
      }
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(null);
    setShowResendButton(false);
    setLoading(true);

    try {
      const endpoint =
        role === "student"
          ? "https://hydersoft.com/api/student/login"
          : "https://hydersoft.com/api/admin/trainer/login";

      const payload =
        role === "student"
          ? {
            email: formData.email,
            password: formData.password,
          }
          : {
            email_id: formData.email,
            password: formData.password,
          };

      const response = await axios.post(endpoint, payload);

      if (response.data.success) {
        console.log("=== LOGIN RESPONSE ===", response.data);
        console.log("=== USER DATA ===", response.data.user);

        // Store user data
        localStorage.setItem(
          role === "student" ? "studentUser" : "trainerUser",
          JSON.stringify(response.data.user)
        );

        // 🔥 Enhanced token handling for trainers
        if (role === "trainer") {
          console.log("=== CHECKING FOR TOKEN ===", {
            token: response.data.token,
            access_token: response.data.access_token,
            auth_token: response.data.auth_token
          });

          let tokenSaved = false;

          if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            console.log("=== TOKEN SAVED ===", response.data.token.substring(0, 20) + '...');
            tokenSaved = true;
          } else if (response.data.access_token) {
            localStorage.setItem('authToken', response.data.access_token);
            console.log("=== ACCESS TOKEN SAVED ===", response.data.access_token.substring(0, 20) + '...');
            tokenSaved = true;
          } else if (response.data.auth_token) {
            localStorage.setItem('authToken', response.data.auth_token);
            console.log("=== AUTH TOKEN SAVED ===", response.data.auth_token.substring(0, 20) + '...');
            tokenSaved = true;
          } else {
            console.error("=== NO TOKEN FOUND IN RESPONSE ===");
            console.log("Available keys:", Object.keys(response.data));
          }

          // Debug: Verify what was saved
          const savedToken = localStorage.getItem('authToken');
          const savedUser = localStorage.getItem('trainerUser');
          console.log("=== VERIFICATION ===");
          console.log("Token saved:", savedToken ? savedToken.substring(0, 20) + '...' : 'NOT FOUND');
          console.log("User saved:", savedUser ? 'YES' : 'NO');

          if (!tokenSaved) {
            setMessage("⚠️ Login successful but authentication token is missing. Some features may not work properly.");
            setIsSuccess(true);
          }
        }

        // Success message
        if (role === "trainer" && !localStorage.getItem('authToken')) {
          setMessage("⚠️ Login successful but with limited functionality. Please contact support if issues persist.");
        } else {
          setMessage("✅ Login successful! Redirecting...");
        }
        
        setIsSuccess(true);
        
        // Small delay to show success message
        setTimeout(() => {
          navigate(role === "student" ? "/student" : "/trainer");
        }, 1500);

      } else {
        setMessage("❌ Login failed. Invalid credentials.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        const { status, data } = error.response;

        if (status === 403 && data.message && data.message.includes("verify")) {
          setMessage("⚠️ Please verify your email before logging in.");
          setIsSuccess(false);
          setShowResendButton(true);
        } else if (status === 401) {
          setMessage("❌ Invalid email or password. Please try again.");
          setIsSuccess(false);
        } else if (status === 422) {
          setMessage("❌ Please check your email format and password.");
          setIsSuccess(false);
        } else if (status === 500) {
          setMessage("🔧 Server error. Please try again later.");
          setIsSuccess(false);
        } else {
          setMessage(data.message || `Error ${status}: Please try again.`);
          setIsSuccess(false);
        }
      } else if (error.request) {
        setMessage("🌐 Network error. Please check your internet connection.");
        setIsSuccess(false);
      } else {
        setMessage("❌ An unexpected error occurred. Please try again.");
        setIsSuccess(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear messages when switching roles
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setMessage("");
    setIsSuccess(null);
    setShowResendButton(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => handleRoleChange("student")}
            className={`px-6 py-2 rounded-l-lg transition-colors duration-200 ${
              role === "student" 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => handleRoleChange("trainer")}
            className={`px-6 py-2 rounded-r-lg transition-colors duration-200 ${
              role === "trainer" 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Trainer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
              placeholder="Enter your password"
            />
            <div
              className="absolute right-4 top-11 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex justify-center items-center font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`
            )}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            isSuccess 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            <p className="text-center text-sm font-medium">{message}</p>
          </div>
        )}

        {/* Resend Verification Button */}
        {showResendButton && (
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full mt-3 bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:bg-orange-400 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
        )}

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              Register here
            </a>
          </p>
          <p>
            <a href="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200">
              Forgot your password?
            </a>
          </p>
        </div>

        {/* Debug Info (Remove in production) */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
            <strong>Debug Info:</strong>
            <br />Role: {role}
            <br />Loading: {loading.toString()}
            <br />Message: {message || 'None'}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Login;
