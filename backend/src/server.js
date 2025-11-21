import express from 'express';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import path from 'path';
import cors from 'cors';
import { serve } from 'inngest/express';
import { inngest, functions } from './lib/inngest.js';
import { clerkMiddleware } from '@clerk/express';
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();
const __dirname = path.resolve();

// ------------------------------
// ✅ MUST BE FIRST — Clerk middleware
// ------------------------------
app.use(clerkMiddleware());


app.use(cors({
  origin:"http://localhost:5173",
  methods:["GET","POST","PUT","DELETE"],
  credentials:true
}));  

// ------------------------------
// ✅ CORS (Fixes your error)
// ------------------------------
app.use(cors({
  origin: ENV.CLIENT_URL,    // http://localhost:5173
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Clerk-User-Id",
    "Clerk-Redirect-To"
  ],
}));

app.use(express.json());

// ------------------------------
// API Routes
// ------------------------------
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'server is running' });
});

// ------------------------------
// Production build serving
// ------------------------------
if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log("server is running on port", ENV.PORT)
    );
  } catch (err) {
    console.error("failed to start server", err);
  }
};

startServer();
