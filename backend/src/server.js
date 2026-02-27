import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();
const __dirname = path.resolve();

// ------------------------------------------------------------
// ✅ CORS — MUST COME BEFORE ROUTES
// ------------------------------------------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",   // frontend local
      ENV.CLIENT_URL             // deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Clerk-User-Id"],
  })
);

// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------
app.use(express.json());
app.use(clerkMiddleware()); // adds req.auth()

// ------------------------------------------------------------
// Routes
// ------------------------------------------------------------
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "API is up and running" });
});

// ------------------------------------------------------------
// Production Deployment Fix
// Express v5 ❌ does NOT support "/{*any}"
// Use "*" instead
// ------------------------------------------------------------
if (ENV.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  const indexHtmlPath = path.join(distPath, "index.html");

  if (fs.existsSync(indexHtmlPath)) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(indexHtmlPath);
    });
  }
}

// ------------------------------------------------------------
// Start the Server
// ------------------------------------------------------------
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log(`🚀 Server running on port: ${ENV.PORT}`)
    );
  } catch (error) {
    console.error("💥 Error starting the server:", error);
  }
};

startServer();
