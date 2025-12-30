import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { requireAuth } from "./middleware/auth.js";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/protected", requireAuth, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

app.get("/db-check", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW() as now");
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed", detail: err.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
