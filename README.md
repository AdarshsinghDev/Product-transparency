📦 Product Review App

An AI-powered product management system that allows users to add products, answer review questions, and generate automated PDF reports. Designed with simplicity, transparency, and scalability in mind.

🚀 Setup Instructions
1. Clone the repository
git clone https://github.com/AdarshsinghDev/Product-transparency
cd product-review-app

2. Install dependencies
npm install

3. Start backend server
cd backend
npm start

4. Start frontend server
cd frontend
npm run dev

5. Access the app

Open https://product-transparency-sable.vercel.app/
 in your browser.

✨ Features

➕ Add Products with category, questions, and answers

📝 Product Review Forms with AI-suggested answers

📊 Dashboard displaying stored products and reviews

🤖 AI Integration for smart Question about Added Product

📄 Generate PDF Reports with product details + answers

🔐 Authentication & Data Storage with MongoDB

⚡ Fast & Minimal UI built with React + Tailwind

🧠 AI Service Documentation

The system integrates with an AI service to enhance product review:

Input: Product details + list of questions

Processing: AI generates dynamic question 

Output: Auto-filled form answers & structured product review

Export: Users can export a PDF report containing product info and AI-enhanced reviews

API Routes:

POST /api/products/basic → Save basic product details

POST /api/products/:id → Add product questions

GET /api/products → Fetch all products with reviews

POST /api/products/report/:id → Generate AI-powered PDF

📝 Example Product Entry + Report

Product Entry:

{
  "productName": "Nokia",
  "category": "Electronics",
  "questions": [
    {
      "question": "What is the battery backup?",
      "answer": "8 hours"
    },
    {
      "question": "Does it support 5G?",
      "answer": "No"
    }
  ]
}


Example Generated Report (PDF):

Title: Product Review Report – Nokia

Category: Electronics

Q&A Section:

Battery Backup → 8 hours

5G Support → No

💡 Reflection

During development of this project, I actively used AI tools such as ChatGPT and Gemini to speed up coding, debug issues, and improve documentation. Instead of spending hours searching manually, I leveraged AI to generate boilerplate code, improve database queries.This allowed me to focus more on core logic and product design.

The architectural choices were guided by principles of modularity, scalability, and transparency. For example, the backend is split into distinct routes for clarity, and the AI service is documented so users understand how product reviews are generated. Transparency was especially important — users should know when AI is assisting and what part of the review comes from human input vs. AI suggestions. This helps build trust and reliability in the system.

Overall, AI tools accelerated my workflow, but I ensured the final product logic remained human-verified, maintainable, and transparent. This balance between automation and responsibility shaped the foundation of this project.
## Deployment

### Frontend (Vercel)

Push your frontend code to GitHub.

Go to Vercel Dashboard
.

Import project → Select frontend folder.

Add environment variable:

VITE_API_URL=https://product-transparency.onrender.com

Deploy → Get live frontend URL.

### Backend (Render)

Push backend code to GitHub.

Go to Render Dashboard
.

Create a new Web Service → Connect backend repo.

Add environment variables:

MONGO_URI=mongodb+srv://adarsh:mypassword****@product-transparency.c0dync2.mongodb.net/product?retryWrites=true&w=majority&appName=product-transparency

PORT=8000

Deploy → Get backend API URL.
## 🚀 About Me

Hi, I’m Adarsh Singh a passionate Full Stack Web Developer pursuing B.Tech in Computer Science and Engineering. I specialize in building modern, scalable, and user-friendly web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js).

📫 How to reach me

GitHub: https://github.com/adarshsinghdev

LinkedIn: https://www.linkedin.com/in/adarshsinghdev/

Email: adarshsingh10803@gmail.com

Portfolio: https://adarshsinghdev.vercel.app/
