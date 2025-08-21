import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/user.routes.js'
import ewasteRoutes from './routes/eWasteRoutes.js'
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());


app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ewaste", ewasteRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export { app };
