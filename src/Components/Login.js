// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const [isSuccess, setIsSuccess] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showResendButton, setShowResendButton] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleResendVerification = async () => {
//     try {
//       setLoading(true);
//       // const response = await axios.post("https://hydersoft.com/api/resend-verification", {
//       //   email: formData.email
//       // });

//       const response = await axios.post("http://127.0.0.1:8000/api/resend-verification", {
//         email: formData.email
//       });

//       setMessage("✅ Verification email sent! Please check your inbox.");
//       setIsSuccess(true);
//       setShowResendButton(false);
//     } catch (error) {
//       if (error.response && error.response.data.message) {
//         setMessage(error.response.data.message);
//       } else {
//         setMessage("Failed to resend verification email.");
//       }
//       setIsSuccess(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setMessage("");
//   setIsSuccess(null);
//   setShowResendButton(false);
//   setLoading(true);

//   try {
//     const response = await axios.post("http://localhost:8000/api/login", {
//       email: formData.email,
//       password: formData.password
//     });

//     if (response.data.success) {
//       localStorage.setItem("studentUser", JSON.stringify(response.data.user));
//       setMessage("Login successful!");
//       setIsSuccess(true);
//       navigate("/student");
//     } else {
//       setMessage("Login failed. Invalid credentials.");
//       setIsSuccess(false);
//     }
//   } catch (error) {
//     if (error.response) {
//       const { status, data } = error.response;

//       if (status === 403 && data.message.includes("verify")) {
//         setMessage("⚠️ Please verify your email before logging in.");
//         setIsSuccess(false);
//         setShowResendButton(true);
//       } else if (status === 401 || status === 422) {
//         setMessage("❌ Login failed. Invalid email or password.");
//         setIsSuccess(false);
//       } else {
//         setMessage(data.message || "An error occurred. Please try again later.");
//         setIsSuccess(false);
//       }
//     } else {
//       setMessage("Network error. Please check your internet connection.");
//       setIsSuccess(false);
//     }
//   } finally {
//     setLoading(false);
//   }
// };

// return (
//   <div className="flex justify-center items-center min-h-screen bg-gray-100">
//     <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Login</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full p-2 mt-1 border rounded bg-gray-200"
//           />
//         </div>

//         <div className="mb-4 relative">
//           <label className="block text-gray-700">Password</label>
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full p-2 mt-1 border rounded bg-gray-200 pr-10"
//           />
//           <div
//             className="absolute right-3 top-10 cursor-pointer text-gray-600"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? <FaEyeSlash /> : <FaEye />}
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition flex justify-center items-center"
//         >
//           {loading ? (
//             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//           ) : (
//             "Login"
//           )}
//         </button>
//       </form>

//       {message && (
//         <div className={`mt-4 p-3 rounded ${isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//           <p className="text-center text-sm">{message}</p>
//         </div>
//       )}

//       {showResendButton && (
//         <button
//           onClick={handleResendVerification}
//           disabled={loading}
//           className="w-full mt-3 bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition"
//         >
//           {loading ? "Sending..." : "Resend Verification Email"}
//         </button>
//       )}

//       <p className="mt-4 text-center">
//         Don't have an account?{" "}
//         <a href="/signup" className="text-blue-500">
//           Register
//         </a>
//       </p>
//       <p className="mt-2 text-center">
//         <a href="/forgot-password" className="text-blue-500 hover:underline">
//           Forgotten password?
//         </a>
//       </p>
//     </div>
//   </div>
// );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("student"); // Toggle between 'student' and 'trainer'
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
      const response = await axios.post("http://127.0.0.1:8000/api/resend-verification", {
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
        ? "http://localhost:8000/api/student/login"
        : "http://localhost:8000/api/admin/trainer/login";

    const payload =
      role === "student"
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            email_id: formData.email, // ✅ corrected here
            password: formData.password,
          };

    const response = await axios.post(endpoint, payload);

    if (response.data.success) {
      localStorage.setItem(
        role === "student" ? "studentUser" : "trainerUser",
        JSON.stringify(response.data.user)
      );
      setMessage("Login successful!");
      setIsSuccess(true);
      navigate(role === "student" ? "/student" : "/trainer");
    } else {
      setMessage("Login failed. Invalid credentials.");
      setIsSuccess(false);
    }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 403 && data.message.includes("verify")) {
        setMessage("⚠️ Please verify your email before logging in.");
        setIsSuccess(false);
        setShowResendButton(true);
      } else if (status === 401 || status === 422) {
        setMessage("❌ Login failed. Invalid email or password.");
        setIsSuccess(false);
      } else {
        setMessage(data.message || "An error occurred. Please try again later.");
        setIsSuccess(false);
      }
    } else {
      setMessage("Network error. Please check your internet connection.");
      setIsSuccess(false);
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setRole("student")}
            className={`px-4 py-2 rounded-l ${
              role === "student" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole("trainer")}
            className={`px-4 py-2 rounded-r ${
              role === "trainer" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Trainer
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded bg-gray-200"
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded bg-gray-200 pr-10"
            />
            <div
              className="absolute right-3 top-10 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              `Login as ${role}`
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded ${isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            <p className="text-center text-sm">{message}</p>
          </div>
        )}

        {showResendButton && (
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full mt-3 bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
        )}

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Register
          </a>
        </p>
        <p className="mt-2 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgotten password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
