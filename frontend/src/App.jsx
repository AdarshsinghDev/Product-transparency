import React, { createContext, useContext, useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ViewProduct from "./pages/viewProduct/ViewProduct";
import ProductReport from "./pages/productReport/ProductReport";
import VerifyOtp from "./pages/verifyOtp/veriftOtp";
import BasicInformationForm from "./pages/addProduct/BasicInformationForm";
import ProductDetailsForm from "./pages/addProduct/ProductDetailForm";
import ReviewSubmitForm from "./pages/addProduct/ReviewSubmitForm";

// Authentication Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Check if user has token (logged in)
        const token = localStorage.getItem("token");
        const storedEmail = localStorage.getItem("userEmail");

        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Keep email for OTP verification if exists
          if (storedEmail) {
            setUserEmail(storedEmail);
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function (called after successful login OR after OTP verification)
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.removeItem("userEmail"); // Remove email after successful login
    setIsAuthenticated(true);
    setUserEmail(null);
    // Navigation will be handled automatically by React Router
  };

  // Signup function (called after successful signup)
  const signup = (email) => {
    localStorage.setItem("userEmail", email);
    setUserEmail(email);
    setIsAuthenticated(false);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  const value = {
    isAuthenticated,
    userEmail,
    loading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route Component (only for authenticated users)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const { isAuthenticated, userEmail, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes - Always accessible */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      
      {/* Home Route Logic */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : userEmail ? (
            <Navigate to="/verify-otp" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected Routes - Only accessible when authenticated */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/basic"
        element={
          <ProtectedRoute>
            <BasicInformationForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product-detail/:id"
        element={
          <ProtectedRoute>
            <ProductDetailsForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/review/:id"
        element={
          <ProtectedRoute>
            <ReviewSubmitForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/view"
        element={
          <ProtectedRoute>
            <ViewProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product"
        element={
          <ProtectedRoute>
            <ProductReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product-report/:id"
        element={
          <ProtectedRoute>
            <ProductReport />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                404 - Page Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The page you're looking for doesn't exist.
              </p>
              <a
                href="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

const AppWithProvider = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWithProvider;