import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Product from '../models/Product.js';
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// Initialize Gemini client ONCE (reused across requests)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ---------------------------
// GET /api/products
// ---------------------------
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ---------------------------
// GET /api/products/stats
// ---------------------------
router.get("/stats", async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const active = await Product.countDocuments({ status: "Active" });
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const thisMonth = await Product.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.json({ total, active, thisMonth });
  } catch (err) {
    console.error("Error fetching product stats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------------------
// POST /api/products/basic
// ---------------------------
router.post('/basic', async (req, res) => {
  const { productName, category } = req.body;

  if (!productName || !category) {
    return res.status(400).json({ error: 'Product name and category are required' });
  }

  // Gemini structured-output schema uses OpenAPI-style uppercase types
  const questionsSchema = {
    type: "ARRAY",
    minItems: 8,
    maxItems: 8,
    items: {
      type: "OBJECT",
      properties: {
        question: { type: "STRING" }
      },
      required: ["question"]
    }
  };

  const prompt = `
You are a product expert.

Product Name: ${productName}
Category: ${category}

Generate exactly 8 questions.

Rules:
- If the product name refers to a specific product (for example Acer Aspire 7, iPhone 15, Samsung Galaxy S24), generate questions specific to that product.
- Do NOT generate generic questions.
- Questions should help collect detailed product information.
- Avoid asking about price, shipping, return policy or customer support.
- Every question should be different.
`;

  let questionsArray = [];
  let usedAI = false;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionsSchema
      }
    });

    // Log raw output while debugging — remove/comment out once confirmed working
    console.log('RAW AI RESPONSE:', response.text);

    const parsed = JSON.parse(response.text);

    if (Array.isArray(parsed) && parsed.length > 0) {
      questionsArray = parsed.map(q => ({ question: q.question, answer: '' }));
      usedAI = true;
    } else {
      throw new Error('AI response did not contain a valid questions array');
    }
  } catch (aiError) {
    console.error('Gemini API error, using fallback questions:', aiError.message);
    const fallbackQuestions = getFallbackQuestions(category);
    questionsArray = fallbackQuestions.map(q => ({ question: q, answer: '' }));
  }

  // Ensure exactly 8 questions no matter what
  if (questionsArray.length < 8) {
    const additionalQuestions = getAdditionalQuestions(category, 8 - questionsArray.length);
    questionsArray = [...questionsArray, ...additionalQuestions.map(q => ({ question: q, answer: '' }))];
  } else if (questionsArray.length > 8) {
    questionsArray = questionsArray.slice(0, 8);
  }

  try {
    const product = new Product({
      productName,
      category,
      questions: questionsArray,
      status: "Active"
    });

    await product.save();

    res.status(201).json({
      ...product.toObject(),
      ...(usedAI ? {} : { warning: 'Created with fallback questions due to AI service unavailability' })
    });
  } catch (dbError) {
    console.error('Database error:', dbError.message);
    res.status(500).json({ error: 'Server error', details: dbError.message });
  }
});

// ---------------------------
// GET /api/products/:id
// ---------------------------
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------------
// PUT /api/products/:id
// ---------------------------
router.put("/:id", async (req, res) => {
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Answers must be an array" });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const updatedQuestions = product.questions.map((q, i) => ({
      ...q.toObject(),
      answer: answers[i] || "",
    }));

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { questions: updatedQuestions },
      { new: true }
    );

    res.status(200).json({ message: "Answers saved successfully!", product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------------
// GET /api/products/:id/pdf
// ---------------------------
router.get('/:id/pdf', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({
      message: 'PDF generation not implemented yet',
      productName: product.productName,
      downloadUrl: '#'
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error generating PDF' });
  }
});

// ---------------------------
// Fallback Questions Functions
// ---------------------------
function getFallbackQuestions(category) {
  const questionsByCategory = {
    electronics: [
      "What are the technical specifications?",
      "What is the warranty period?",
      "Is it compatible with other devices?",
      "What's included in the box?",
      "What are the power requirements?",
      "How do I set it up?",
      "What are the dimensions and weight?",
      "What are the available colors?"
    ],
    clothing: [
      "What sizes are available?",
      "What material is it made from?",
      "How should I care for this item?",
      "What is the fit like?",
      "What colors are available?",
      "Can I return if it doesn't fit?",
      "Is it suitable for all seasons?",
      "How do I check the size chart?"
    ],
    home: [
      "What are the dimensions?",
      "What materials is it made from?",
      "How easy is it to assemble?",
      "What tools are needed for setup?",
      "How do I clean and maintain it?",
      "What is the weight capacity?",
      "Is installation service available?",
      "What colors/finishes are available?"
    ],
    books: [
      "How many pages does it have?",
      "What genre/category is it?",
      "Who is the target audience?",
      "Is it part of a series?",
      "What format is available?",
      "What language is it written in?",
      "When was it published?",
      "Are there any reviews available?"
    ],
    sports: [
      "What skill level is this for?",
      "What are the dimensions/specifications?",
      "What materials is it made from?",
      "How durable is it?",
      "What accessories are included?",
      "How do I maintain it?",
      "Is it suitable for outdoor use?",
      "What safety features does it have?"
    ],
    toys: [
      "What age group is this suitable for?",
      "Is it safe for children?",
      "What materials is it made from?",
      "Does it require batteries?",
      "How do you clean it?",
      "What skills does it help develop?",
      "Are there any small parts?",
      "Is assembly required?"
    ]
  };

  return questionsByCategory[category] || [
    "What are the main features?",
    "How do I use this product?",
    "What is the return policy?",
    "How long does shipping take?",
    "What are the dimensions?",
    "What materials is it made from?",
    "Is there a warranty?",
    "How do I contact customer support?"
  ];
}

function getAdditionalQuestions(category, needed) {
  const additional = [
    "What is the price range?",
    "Are there bulk discounts available?",
    "How long will this product last?",
    "What makes this different from competitors?",
    "Are there any maintenance requirements?",
    "Can this be customized?",
    "Is technical support available?",
    "What payment methods do you accept?"
  ];

  return additional.slice(0, needed);
}

export default router;
