import React, { useEffect, useState } from "react";
import { Plus, Package, LogOut, Bell, Settings, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App"; // Import useAuth
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout function from auth context

  // State for stats
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [productsThisMonth, setProductsThisMonth] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/stats`);
        // Assuming your backend returns: { total, active, thisMonth }
        setTotalProducts(res.data.total || 0);
        setActiveProducts(res.data.active || 0);
        setProductsThisMonth(res.data.thisMonth || 0);
      } catch (err) {
        console.error("Failed to fetch product stats:", err);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  ProductTransparency
                </h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, User
          </h2>
          <p className="text-gray-600">
            Manage your product transparency and track performance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Products
                </p>
                <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">+{productsThisMonth}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Product Management
            </h3>
            <p className="text-gray-600">
              Add new products or manage your existing inventory
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/basic")}
              className="group flex flex-col items-center justify-center p-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <Plus className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Add New Product</h4>
              <p className="text-blue-100 text-sm text-center">
                Create transparency reports for new products
              </p>
            </button>

            <button
              onClick={() => navigate("/view")}
              className="group flex flex-col items-center justify-center p-8 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500/50"
            >
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-gray-200 rounded-full flex items-center justify-center mb-4 transition-colors">
                <Package className="h-8 w-8 text-gray-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">View All Products</h4>
              <p className="text-gray-600 text-sm text-center">
                Browse and manage your product catalog
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}