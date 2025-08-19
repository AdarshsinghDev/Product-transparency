import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Download } from "lucide-react";
import jsPDF from "jspdf";

export default function ReviewSubmitForm() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch product data.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  // PDF generation
  const downloadPDF = () => {
    if (!product) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Product Review: ${product.productName}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Category: ${product.category}`, 10, 30);
    doc.text("Questions & Answers:", 10, 40);

    let yPos = 50;
    product.questions.forEach((q, index) => {
      const question = `${index + 1}. ${q.question}`;
      const answer = `Answer: ${q.answer || "-"}`;
      
      // Add question
      doc.text(question, 10, yPos);
      yPos += 7;
      
      // Add answer
      doc.text(answer, 12, yPos);
      yPos += 10;

      // Page break if needed
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(`${product.productName}_Review.pdf`);
  };

  if (loading) return <div className="text-center mt-20">Loading product data...</div>;
  if (!product) return <div className="text-center mt-20">Product not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Review</h1>
          <p className="text-gray-600">Review the product details and answers below</p>
        </div>

        {/* Product Info */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <p><span className="font-semibold">Product Name:</span> {product.productName}</p>
          <p><span className="font-semibold">Category:</span> {product.category}</p>
        </div>

        {/* Questions & Answers */}
        <div className="space-y-4">
          {product.questions?.map((q, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="font-medium">{index + 1}. {q.question}</p>
              <p className="text-gray-700 mt-1"><span className="font-semibold">Answer:</span> {q.answer || "-"}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={downloadPDF}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Download PDF
            <Download className="h-4 w-4 ml-2" />
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Done
            <CheckCircle className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
