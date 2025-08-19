import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./utils/db.js";
import otpRoute from "./routes/otpRoute.js"
import productRoute from "./routes/productRoute.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoute);
app.use("/api/products", productRoute);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on Port", PORT)
})