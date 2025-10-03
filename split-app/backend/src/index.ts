import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import walletRoutes from "./routes/wallet.routes";
import { connectDB, disconnectDB } from "../prisma/prisma";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://split-app-zeta.vercel.app" // your production frontend
];

app.use(cors({
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/health", (req, res) => {
  res.send("API server is healthy");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n Shutting down gracefully...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n Shutting down gracefully...');
  await disconnectDB();
  process.exit(0);
});
