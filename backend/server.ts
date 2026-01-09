import dotenv from "dotenv";
dotenv.config();
import tmdbRoutes from "./src/routes/tmdb";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/user";
import movieRoutes from "./src/routes/movie";
import { createTables } from "./src/database/database";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/user", userRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/tmdb", tmdbRoutes);

// Start server
const PORT = 3001;

(async () => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to init database:", err);
    process.exit(1);
  }
})();
