import express from "express";
import authRoutes from "./routes/auth.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import cors from "cors"
import commentRoutes from "./routes/comment.route.js"

dotenv.config()

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("database is connected !"))
.catch((err)=> console.log(err) )

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173",  // 👈 your frontend origin
    credentials: true,                // 👈 allows cookies / tokens
  })
)

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/comment", commentRoutes);


app.listen(5000 , ()=> {
    console.log("sever is running on port 3000 !")
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500

  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
