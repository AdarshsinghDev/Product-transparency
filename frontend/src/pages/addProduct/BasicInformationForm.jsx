import React, { useState } from "react";
import { Package, Tag, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BasicInformationForm() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleNext = async (e) => {
    e.preventDefault();

    if (!productName || !category) {
      alert("Please enter product name and select category");
      return;
    }

    try {
      // Send data to backend route /api/products/basic
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/basic`,
        {
          productName,
          category,
        }
      );

      console.log("Backend response:", res);
      if (res.status === 201) {
        const productId = res.data._id;
        navigate(`/product-detail/${productId}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error creating product. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Basic Information
            </h1>
            <p className="text-gray-600">Tell us about your product</p>
          </div>

          {/* Form Fields */}
          <form className="space-y-6" onSubmit={handleNext}>
            {/* Product Name */}
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home-furniture">Home & Furniture</option>
                  <option value="appliances">Appliances</option>
                  <option value="books">Books</option>
                  <option value="sports">Sports</option>
                  <option value="toys">Toys</option>
                  <option value="food-beverages">Food & Beverages</option>
                  <option value="health-beauty">Health & Beauty</option>
                  <option value="automotive">Automotive</option>
                  <option value="grocery">Grocery</option>
                  <option value="jewelry">Jewelry & Accessories</option>
                  <option value="office-supplies">Office Supplies</option>
                  <option value="pet-supplies">Pet Supplies</option>
                  <option value="music-movies">Music, Movies & Games</option>
                  <option value="baby-products">Baby Products</option>
                  <option value="stationery">Stationery</option>
                  <option value="industrial">Industrial & Tools</option>
                  <option value="travel">Travel & Luggage</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            {/* Navigation Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
