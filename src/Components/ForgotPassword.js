import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(null);
    setIsSubmitting(true); // Start loading

    try {
      const response = await axios.post("https://hydersoft.com/api/forgot-password", { email });

      if (response.data.message) {
        setMessage("Reset link sent to your email.");
        setSuccess(true);
      }
    } catch (error) {
      setMessage("Email not found or error sending reset link.");
      setSuccess(false);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 mb-2">Enter your registered email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4 bg-gray-200"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 rounded text-white transition ${
              isSubmitting ? "bg-blue-300 cursor-wait" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center ${success ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
