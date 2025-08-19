import React from "react";
import { User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App"; // Import useAuth hook

export default function Signup() {
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth(); // Use auth context

  useEffect(() => {
    if (user.cpassword && user.cpassword !== user.password) {
      setMessage("Password doesn't match");
    } else {
      setMessage("");
    }
  }, [user.cpassword, user.password]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.fullname || !user.email || !user.password || !user.cpassword) {
      setMessage("Please fill all fields");
      return;
    }

    if (user.password !== user.cpassword) {
      setMessage("Passwords don't match");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        { fullname: user.fullname, email: user.email, password: user.password }
      );

      if (res.status === 201) {
        console.log("Signup successfully!");
        // Use auth context signup function
        signup(res.data.user.email);
        setMessage("Signup successful! Redirecting to OTP verification...");
        
        // Navigate to OTP verification page
        setTimeout(() => {
          navigate("/verify-otp");
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message);
      } else {
        console.log("handleSubmit error", error);
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">📒</span>
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              Create account
            </h1>
            <p className="text-sm text-gray-600">
              Enter your details to get started
            </p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} method="post" className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={user.fullname}
                  onChange={handleChange}
                  name="fullname"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Create a password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="cpassword"
                  value={user.cpassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Confirm your password"
                />
              </div>
              {message && (
                <p className={`text-xs mt-1 ${message.includes('successful') ? 'text-green-600' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              Create account
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}