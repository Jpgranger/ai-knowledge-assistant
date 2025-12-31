import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import { authRouter } from "./routes/auth.js";
import requireUser from "./middleware/auth.js";
import documentsRouter from "./routes/documents.js";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/documents", documentsRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/protected", requireUser, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

app.get("/db-check", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW() as now");
    res.json(r.rows[0]);
} catch (err) {
    // 23505 = unique_violation (email already exists)
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
 }});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
