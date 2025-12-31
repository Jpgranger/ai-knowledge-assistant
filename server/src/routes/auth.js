import express from "express";
import bcrypt from "bcryptjs";
import requireUser from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing email/password" });

  const hash = await bcrypt.hash(password, 12);

  try {
    const { rows } = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email.toLowerCase(), hash]
    );

    const user = rows[0];
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch {
    res.status(409).json({ error: "Email already registered" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing email/password" });

  const { rows } = await pool.query(
    "SELECT id, email, password_hash FROM users WHERE email=$1",
    [email.toLowerCase()]
  );

  const user = rows[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user: { id: user.id, email: user.email } });
});

authRouter.get("/me", requireUser, (req, res) => {
  res.json({ user: req.user });
});