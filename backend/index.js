import express from "express";
import authRoutes from "./routes/auth.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import cors from "cors";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const app = express();

// === CORS MUST BE FIRST ===
const allowedOrigins = [
  "http://localhost:5173",
    "https://newstoday.vercel.app",
  "https://news-today-lm8p-git-main-vikas-projects-255d0fe9.vercel.app",
  "https://news-today-lm8p-fr1rpreyj-vikas-projects-255d0fe9.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


// Required on some hosts (Render included)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(cookieParser());

// === ROUTES ===
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// === ERROR HANDLER ===
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
