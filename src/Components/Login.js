import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // 👈 Password toggle state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(null);

    try {
      const response = await axios.post("https://hydersoft.com/api/login", formData);
      // const response = await axios.post("http://127.0.0.1:8000/api/login", formData);
      

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token);
        setMessage("Login successful!");
        setIsSuccess(true);
        navigate("/user-dashboard");
      } else {
        setMessage("Login failed. Invalid credentials.");
        setIsSuccess(false);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 422) {
          setMessage("Login failed. Invalid credentials.");
        } else {
          setMessage("An error occurred. Please try again later.");
        }
      } else {
        setMessage("Network error. Please check your internet connection.");
      }
      setIsSuccess(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
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

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
            Login
          </button>
        </form>

        {message && <p className={`mt-4 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        <p className="mt-4 text-center">
          Don't have an account? <a href="/signup" className="text-blue-500">Register</a>
        </p>
        <p className="mt-2 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:underline">Forgotten password?</a>
        </p>

      </div>
    </div>
  );
};

export default Login;