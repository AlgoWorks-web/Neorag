import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  /* ─────── state ─────── */
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const navigate = useNavigate();

  /* ─────── helpers ─────── */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setMessage("");
    setIsSuccess(null);
    setShowResendButton(false);
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://hydersoft.com/api/student/resend-verification",
        { email: formData.email }
      );
      setMessage("✅ Verification email sent! Please check your inbox.");
      setIsSuccess(true);
      setShowResendButton(false);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to resend verification email."
      );
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
      /* endpoint & payload depend on role */
      const endpoint =
        role === "student"
          ? "https://hydersoft.com/api/student/login"
          : "https://hydersoft.com/api/admin/trainer/login";

      const payload =
        role === "student"
          ? { email: formData.email, password: formData.password }
          : { email_id: formData.email, password: formData.password };

      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        /* store user */
        localStorage.setItem(
          role === "student" ? "studentUser" : "trainerUser",
          JSON.stringify(data.user)
        );

        /* store token for trainer (various key names) */
        if (role === "trainer") {
          const token =
            data.token || data.access_token || data.auth_token || null;
          if (token) localStorage.setItem("authToken", token);
        }

        setMessage("✅ Login successful! Redirecting…");
        setIsSuccess(true);
        setTimeout(
          () => navigate(role === "student" ? "/student" : "/trainer"),
          1500
        );
      } else {
        setMessage("❌ Login failed. Invalid credentials.");
        setIsSuccess(false);
      }
    } catch (err) {
      const { status, data } = err.response || {};
      if (status === 403 && data?.message?.includes("verify")) {
        setMessage("⚠️ Please verify your email before logging in.");
        setShowResendButton(true);
      } else if (status === 401) {
        setMessage("❌ Invalid email or password. Please try again.");
      } else if (status === 422) {
        setMessage("❌ Please check your email format and password.");
      } else if (status === 500) {
        setMessage("🔧 Server error. Please try again later.");
      } else if (err.request) {
        setMessage("🌐 Network error. Please check your connection.");
      } else {
        setMessage("❌ An unexpected error occurred. Please try again.");
      }
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  /* ─────── UI ─────── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-blue-100 p-8">
        {/* Header */}
        <h1 className="text-center text-3xl font-extrabold text-blue-700 mb-2">
          Sign in
        </h1>
        <p className="text-center text-sm text-blue-500 mb-8">
          Choose your role and enter your credentials
        </p>

        {/* Role toggle */}
        <div className="flex mb-8 overflow-hidden rounded-lg ring-1 ring-blue-200">
          {["student", "trainer"].map((r) => (
            <button
              key={r}
              onClick={() => handleRoleChange(r)}
              className={`flex-1 py-2 transition-colors text-sm font-semibold
                ${
                  role === r
                    ? "bg-blue-600 text-white shadow-inner"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <label className="block">
            <span className="block text-sm font-medium text-blue-700 mb-1">
              Email address
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-blue-200 bg-blue-50/30 px-4 py-3
                         placeholder-blue-300 focus:(outline-none ring-2 ring-blue-500)
                         transition-shadow"
              placeholder="you@example.com"
            />
          </label>

          {/* Password */}
          <label className="block relative">
            <span className="block text-sm font-medium text-blue-700 mb-1">
              Password
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-blue-200 bg-blue-50/30 px-4 py-3 pr-12
                         placeholder-blue-300 focus:(outline-none ring-2 ring-blue-500)
                         transition-shadow"
              placeholder="••••••••"
            />
            <span
              className="absolute top-9 right-4 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600
                       py-3 text-white font-semibold shadow-md hover:bg-blue-700
                       disabled:(bg-blue-300 cursor-not-allowed) transition-colors"
          >
            {loading && (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Signing in…" : `Login as ${role}`}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`mt-6 rounded-lg px-4 py-3 text-sm font-medium
              ${
                isSuccess
                  ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                  : "bg-red-50 text-red-700 ring-1 ring-red-200"
              }`}
          >
            {message}
          </div>
        )}

        {/* Resend verification */}
        {showResendButton && (
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full mt-4 rounded-lg bg-blue-500 py-2 text-white font-semibold
                       hover:bg-blue-600 disabled:(bg-blue-300 cursor-not-allowed)
                       transition-colors"
          >
            {loading ? "Sending…" : "Resend Verification Email"}
          </button>
        )}

        {/* Footer */}
        <div className="mt-10 space-y-2 text-center text-sm">
          <p className="text-blue-600">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="font-semibold hover:underline hover:text-blue-800"
            >
              Register here
            </a>
          </p>
          <p>
            <a
              href="/forgot-password"
              className="text-blue-500 hover:text-blue-800 hover:underline"
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

