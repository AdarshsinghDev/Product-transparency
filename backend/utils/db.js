import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        mongoose.connect(process.env.mongoDB_URI);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.log("DB Error", error)
    }
}
export default connectDB;