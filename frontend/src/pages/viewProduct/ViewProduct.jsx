// ===== UPDATED ViewProduct.jsx =====
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  Download,
  Package,
  Calendar,
  Tag,
  AlertCircle,
  Loader,
  Plus,
} from "lucide-react";

export default function ViewProduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("All Categories");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");

      // Load demo products as fallback
      setProducts([
        {
          _id: "demo-1",
          productName: "Organic Apple Juice",
          category: "Food",
          createdAt: "2024-03-15T10:30:00Z",
          status: "Active",
        },
        {
          _id: "demo-2",
          productName: "Smart LED Bulb Pro",
          category: "Electronics",
          createdAt: "2024-03-10T15:45:00Z",
          status: "Active",
        },
        {
          _id: "demo-3",
          productName: "Moisturizing Face Cream",
          category: "Cosmetics",
          createdAt: "2024-03-12T09:20:00Z",
          status: "Active",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: "bg-green-100 text-green-800",
      Electronics: "bg-blue-100 text-blue-800",
      Cosmetics: "bg-purple-100 text-purple-800",
      Others: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.Others;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewReport = (productId) => {
    // Navigate to product report with the product ID
    navigate(`/product?id=${productId}`);
  };

  const handleDownloadPDF = (productId) => {
    // Navigate to review page with the product ID for PDF download
    navigate(`/review/${productId}`);
  };

  const handleAddProduct = () => {
    navigate("/basic");
  };

  const filteredProducts = products.filter(
    (p) =>
      (filter === "All Categories" || p.category === filter) &&
      p.productName.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [
    "All Categories",
    "Food",
    "Electronics",
    "Cosmetics",
    "Others",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-900">📦 Your Products</h1>
          {error && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Using demo data - {error}</span>
            </div>
          )}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex gap-4 lg:flex-row md:flex-row flex-col">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={fetchProducts}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleAddProduct}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {search || filter !== "All Categories"
                ? "Try adjusting your search or filter criteria."
                : "Create your first product to get started."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("All Categories");
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={handleAddProduct}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.productName}
                  </h3>
                  {product._id.startsWith("demo-") && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Demo
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      product.category
                    )}`}
                  >
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4" />
                  {formatDate(product.createdAt || product.createdDate)}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleViewReport(product._id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Report
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(product._id)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {products.length}
              </div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {products.filter((p) => p.status === "Active").length}
              </div>
              <div className="text-sm text-gray-600">Active Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {new Set(products.map((p) => p.category)).size}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {filteredProducts.length}
              </div>
              <div className="text-sm text-gray-600">Filtered Results</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add New Product
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}