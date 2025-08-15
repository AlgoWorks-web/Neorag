import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  /* ─────── state ─────── */
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ─────── helpers ─────── */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(null);
    setErrors({});
    setLoading(true); // Start loading

    try {
      const response = await axios.post("https://hydersoft.com/api/student/register", formData);
     //  const response = await axios.post("http://localhost:8000/api/student/register", formData);
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

  /* ─────── UI ─────── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-blue-100 p-8">
        {/* Header */}
        <h1 className="text-center text-3xl font-extrabold text-blue-700 mb-2">
          Create account
        </h1>
        <p className="text-center text-sm text-blue-500 mb-8">
          It’s quick and easy
        </p>

        {/* Message banner */}
        {message && (
          <div
            className={`mb-6 rounded-lg px-4 py-3 text-sm font-medium ${
              isSuccess
                ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                : "bg-red-50 text-red-700 ring-1 ring-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <label className="block">
            <span className="block text-sm font-medium text-blue-700 mb-1">
              Username<span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-blue-200 bg-blue-50/30 px-4 py-3 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="john_doe"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username[0]}</p>
            )}
          </label>

          {/* Email */}
          <label className="block">
            <span className="block text-sm font-medium text-blue-700 mb-1">
              Email<span className="text-red-500">*</span>
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-blue-200 bg-blue-50/30 px-4 py-3 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
            )}
          </label>

          {/* Password */}
          <label className="block relative">
            <span className="block text-sm font-medium text-blue-700 mb-1">
              Password<span className="text-red-500">*</span>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-blue-200 bg-blue-50/30 px-4 py-3 pr-12 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="••••••••"
            />
            <span
              className="absolute top-9 right-4 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
            )}
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-white font-semibold shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading && (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-10 text-center text-sm text-blue-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline hover:text-blue-800"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
