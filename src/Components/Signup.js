import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 👈 Loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(null);
    setErrors({});
    setLoading(true); // Start loading

    try {
      // const response = await axios.post("https://hydersoft.com/api/register", formData);
      const response = await axios.post("http://localhost:8000/api/register", formData);
      setMessage("🎉 Registration successful! check your mail and  You can now log in.");
      setIsSuccess(true);
      setFormData({ username: "", email: "", password: "" });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const backendErrors = error.response.data.errors;
        setErrors(backendErrors);

        if (
          backendErrors.email?.[0]?.includes("taken") ||
          backendErrors.username?.[0]?.includes("taken")
        ) {
          setMessage("❌ Username or Email already exists.");
        } else {
          setMessage("❌ Registration failed. Please check your details.");
        }
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }

      setIsSuccess(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>

        {message && (
          <div
            className={`p-3 mb-4 text-sm rounded text-center font-medium ${
              isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full p-2 mt-1 border rounded bg-gray-100"
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E.g. john@doe.com"
              className="w-full p-2 mt-1 border rounded bg-gray-100"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-2 mt-1 border rounded bg-gray-100"
              required
            />
            <div className="text-sm text-gray-500 mt-1">
              {showPassword ? "🔓 Visible" : "🔒 Hidden"}
              <button
                type="button"
                className="ml-2 text-blue-500 underline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
