// models/Product.js
import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, default: "" },
});

const ProductSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    category: { type: String, required: true },
    questions: [QuestionSchema], // Gemini API questions + answers
    status: { type: String, default: "Draft" },
    createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product; // <-- ESM export