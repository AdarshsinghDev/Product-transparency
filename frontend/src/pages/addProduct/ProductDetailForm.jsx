import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetailForm() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
        );
        setProduct(res.data);
        setAnswers(res.data.questions.map((q) => q.answer || ""));
      } catch (err) {
        console.error(err);
        alert("Failed to fetch product");
      }
    };
    fetchProduct();
  }, [id]);

  // Handle input change
  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    // Auto-save after typing
    autoSave(newAnswers);
  };

  // Auto-save debounce
  let saveTimeout;
  const autoSave = (newAnswers) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      setSaving(true);
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
          { answers: newAnswers }
        );
      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        setSaving(false);
      }
    }, 1000); // save 1s after user stops typing
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
        { answers }
      );

      if (res.status == 200) {
        navigate(`/review/${id}`, { state: { product: res.data } });
      }
      alert("Answers saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save answers.");
    } finally {
      setSaving(false);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Questions
          </h1>
          <p className="text-gray-600">
            Answer the questions below for{" "}
            <span className="font-semibold">{product.productName}</span> (
            {product.category})
          </p>
          {saving && <p className="text-sm text-gray-500 mt-1 absolute">Saving...</p>}
        </div>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {product.questions.map((q, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i + 1}. {q.question}
              </label>
              <input
                type="text"
                value={answers[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder="Enter your answer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
