import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App"; // Import useAuth hook

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { userEmail, login } = useAuth(); // Use login instead of verifyOtp
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/otp/verify-otp`,
        {
          email: userEmail,
          otp,
        }
      );

      if (res.status === 200) {
        setMessage("OTP verified successfully! Logging you in...");
        console.log("OTP verified for:", userEmail);

        // Check if your backend returns user data and token after OTP verification
        if (res.data.token && res.data.user) {
          // If backend provides token and user data, log them in directly
          login(res.data.token, res.data.user);
          // Navigation will be automatic via protected routes
        } else {
          // If backend doesn't provide token, you have two options:
          
          // Option 1: Auto-login with a separate API call
          try {
            const loginRes = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/auth/auto-login-after-otp`,
              { email: userEmail }
            );
            login(loginRes.data.token, loginRes.data.user);
          } catch (autoLoginError) {
            // Option 2: Just redirect to login page
            setTimeout(() => {
              navigate("/login");
            }, 1500);
          }
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message);
      } else {
        console.log("handleSubmit error", error);
        setMessage("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          🔒 Verify Your Account
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mb-6">
          Enter the 6-digit code sent to {userEmail}
        </p>

        {/* OTP Inputs */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-between gap-2 mb-6"
        >
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            placeholder="O T P"
            className="w-1/2 h-12 mb-3 text-center border rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            required
          />

          {message && (
            <p
              className={`text-xs mt-1 mb-3 ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 py-3 bg-blue-600 text-white rounded-2xl font-semibold text-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-4">
          <p className="text-gray-500 text-sm">
            Didn't receive the code?{" "}
            <button className="text-blue-600 hover:underline font-medium">
              Resend OTP
            </button>
          </p>
        </div>

        {/* Countdown Timer (static placeholder) */}
        <p className="mt-2 text-gray-400 text-sm">Expires in 02:00</p>
      </div>
    </div>
  );
}