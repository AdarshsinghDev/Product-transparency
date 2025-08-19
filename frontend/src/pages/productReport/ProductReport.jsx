import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Package,
  Calendar,
  Tag,
  CheckCircle,
  XCircle,
  Shield,
  Zap,
  Award,
  Clock,
  Leaf,
  AlertCircle,
  Loader,
} from "lucide-react";

export default function ProductReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const productId = searchParams.get("id");
    if (productId === "demo" || !productId) {
      // Load demo data for presentation
      setTimeout(() => {
        setProduct(getDemoProduct());
        setLoading(false);
      }, 500);
    } else {
      fetchProduct(productId);
    }
  }, [searchParams]);

  const fetchProduct = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();

      // Transform the product data to include icons and formatting
      const transformedProduct = {
        ...data,
        questions: data.questions.map((q, index) => ({
          ...q,
          id: index + 1,
          icon: getQuestionIcon(q.question, data.category),
          type: getQuestionType(q.question, q.answer),
          highlight: isHighlightQuestion(q.question, q.answer),
        })),
      };

      setProduct(transformedProduct);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product data");
      // Load demo data as fallback
      setProduct(getDemoProduct());
    } finally {
      setLoading(false);
    }
  };

  const getDemoProduct = () => ({
    _id: "demo-id",
    productName: "Organic Apple Juice",
    category: "Food",
    createdAt: "2024-03-15T10:30:00Z",
    status: "Active",
    questions: [
      {
        id: 1,
        question: "Does it contain preservatives?",
        answer: "No",
        type: "boolean",
        icon: Leaf,
        highlight: true,
      },
      {
        id: 2,
        question: "Is it organic certified?",
        answer: "Yes",
        type: "boolean",
        icon: CheckCircle,
        highlight: true,
      },
      {
        id: 3,
        question: "What is the expiry date?",
        answer: "2024-12-31",
        type: "date",
        icon: Calendar,
        highlight: false,
      },
      {
        id: 4,
        question: "Where is it manufactured?",
        answer: "California, USA",
        type: "text",
        icon: Package,
        highlight: false,
      },
      {
        id: 5,
        question: "What certifications does it have?",
        answer: "USDA Organic Certified",
        type: "text",
        icon: Award,
        highlight: true,
      },
      {
        id: 6,
        question: "What is the shelf life?",
        answer: "18 months",
        type: "text",
        icon: Clock,
        highlight: false,
      },
      {
        id: 7,
        question: "Is it gluten-free?",
        answer: "Yes",
        type: "boolean",
        icon: Shield,
        highlight: false,
      },
      {
        id: 8,
        question: "What is the sugar content?",
        answer: "12g per 100ml (natural fruit sugars)",
        type: "text",
        icon: Zap,
        highlight: false,
      },
    ],
  });

  const getQuestionIcon = (question, category) => {
    const questionLower = question.toLowerCase();

    // Category-specific icons
    if (category === "Electronics") {
      if (
        questionLower.includes("warranty") ||
        questionLower.includes("guarantee")
      )
        return Shield;
      if (
        questionLower.includes("power") ||
        questionLower.includes("energy") ||
        questionLower.includes("watt")
      )
        return Zap;
      if (
        questionLower.includes("certification") ||
        questionLower.includes("rating")
      )
        return Award;
      return Package;
    }

    if (category === "Food") {
      if (
        questionLower.includes("organic") ||
        questionLower.includes("natural")
      )
        return Leaf;
      if (
        questionLower.includes("expiry") ||
        questionLower.includes("shelf") ||
        questionLower.includes("date")
      )
        return Calendar;
      if (
        questionLower.includes("certification") ||
        questionLower.includes("certified")
      )
        return Award;
      if (
        questionLower.includes("preservative") ||
        questionLower.includes("gluten") ||
        questionLower.includes("allergen")
      )
        return Shield;
    }

    // Generic icons based on question content
    if (questionLower.includes("date") || questionLower.includes("time"))
      return Calendar;
    if (
      questionLower.includes("certification") ||
      questionLower.includes("award") ||
      questionLower.includes("rating")
    )
      return Award;
    if (
      questionLower.includes("warranty") ||
      questionLower.includes("safety") ||
      questionLower.includes("secure")
    )
      return Shield;
    if (questionLower.includes("energy") || questionLower.includes("power"))
      return Zap;
    if (
      questionLower.includes("environment") ||
      questionLower.includes("eco") ||
      questionLower.includes("green")
    )
      return Leaf;
    if (
      questionLower.includes("time") ||
      questionLower.includes("duration") ||
      questionLower.includes("life")
    )
      return Clock;

    return Package;
  };

  const getQuestionType = (question, answer) => {
    const answerLower = answer.toLowerCase();
    if (answerLower === "yes" || answerLower === "no") return "boolean";
    if (answer.match(/\d{4}-\d{2}-\d{2}/)) return "date";
    if (
      question.toLowerCase().includes("rating") &&
      (answerLower.includes("a+") ||
        answerLower.includes("excellent") ||
        answerLower.includes("good"))
    )
      return "rating";
    return "text";
  };

  const isHighlightQuestion = (question, answer) => {
    const questionLower = question.toLowerCase();
    const answerLower = answer.toLowerCase();

    // Highlight important certifications, safety features, and key benefits
    if (
      questionLower.includes("certified") ||
      questionLower.includes("certification")
    )
      return true;
    if (questionLower.includes("organic") && answerLower === "yes") return true;
    if (questionLower.includes("warranty") && answer.includes("month"))
      return true;
    if (
      questionLower.includes("rating") &&
      (answerLower.includes("a+") || answerLower.includes("excellent"))
    )
      return true;
    if (questionLower.includes("preservative") && answerLower === "no")
      return true;
    if (questionLower.includes("energy") && answerLower.includes("a+"))
      return true;

    return false;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: "bg-green-100 text-green-800 border-green-200",
      Electronics: "bg-blue-100 text-blue-800 border-blue-200",
      Cosmetics: "bg-purple-100 text-purple-800 border-purple-200",
      Others: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category] || colors.Others;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAnswerBadge = (answer, type, highlight) => {
    if (type === "boolean") {
      if (answer.toLowerCase() === "yes") {
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            <CheckCircle className="h-4 w-4" />
            Yes
          </span>
        );
      } else if (answer.toLowerCase() === "no") {
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
            <XCircle className="h-4 w-4" />
            No
          </span>
        );
      }
    }

    if (highlight) {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {answer}
        </span>
      );
    }

    return <span className="text-gray-900 font-medium">{answer}</span>;
  };

  const handleBackClick = () => {
    navigate("/view");
  };

  const handlePDFDownload = () => {
    const productId = searchParams.get("id");
    if (productId && productId !== "demo" && !productId.startsWith("demo-")) {
      window.open(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/pdf`,
        "_blank"
      );
    } else {
      alert(
        "PDF download is not available for demo data. Please create a real product first."
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product?.productName} - Transparency Report`,
          text: `Check out the transparency report for ${product?.productName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Report URL copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading product report...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Report
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isDemoMode =
    searchParams.get("id") === "demo" ||
    !searchParams.get("id") ||
    searchParams.get("id").startsWith("demo-");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Product List
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📑 Product Transparency Report
          </h1>
          <p className="text-gray-600">
            Complete transparency information for this product
          </p>
          {isDemoMode && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              <AlertCircle className="h-4 w-4" />
              Demo Mode - Showing sample data
            </div>
          )}
        </div>

        {/* Product Information Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Package className="h-6 w-6 text-gray-400" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {product?.productName}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                      product?.category
                    )}`}
                  >
                    {product?.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Created on{" "}
                  {formatDate(product?.createdAt || product?.createdDate)}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={handlePDFDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Product Details & Transparency Information
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              All questions and answers about this product
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {product?.questions?.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id || index}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          {item.question}
                        </h4>
                        <div className="text-sm text-gray-500">
                          Question {index + 1} of {product.questions.length}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 sm:text-right">
                      {getAnswerBadge(item.answer, item.type, item.highlight)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {product?.questions?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {product?.questions?.filter((q) => q.highlight).length || 0}
            </div>
            <div className="text-sm text-gray-600">Key Highlights</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
            <div className="text-sm text-gray-600">Transparency</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Need more information?
              </h3>
              <p className="text-sm text-gray-600">
                Contact us for additional product details or certifications.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => alert("Contact support feature would open here")}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors"
              >
                Share Report
              </button>
            </div>
          </div>
        </div>

        {/* Report Generation Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Report generated on {formatDate(new Date().toISOString())} • Product
          Transparency System v2.0
        </div>
      </div>
    </div>
  );
}
