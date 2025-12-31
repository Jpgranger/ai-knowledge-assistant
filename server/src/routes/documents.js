import express from "express";
import upload from "../middleware/upload.js";
import requireUser from "../middleware/auth.js";
import { pool } from "../db.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

/**
 * POST /documents/upload
 * Protected: requires JWT
 * form-data key: "file"
 */
router.post("/upload", requireUser, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded (field name must be 'file')" });
    }

    const { originalname, filename, mimetype, size } = req.file;

    const result = await pool.query(
      `
      INSERT INTO documents (user_id, original_filename, stored_filename, mime_type, size_bytes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [req.user.id, originalname, filename, mimetype, size]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /documents/upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

/**
 * GET /documents
 * Protected: requires JWT
 * List documents for the logged-in user
 */
router.get("/", requireUser, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, user_id, title, original_filename, mime_type, status, created_at, stored_filename, size_bytes
      FROM documents
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("GET /documents error:", err);
    return res.status(500).json({ error: "Failed to fetch documents" });
  }
});

/**
 * GET /documents/:id   (6b)
 * Protected: requires JWT
 * Get a single document (must belong to user)
 */
router.get("/:id", requireUser, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT id, user_id, title, original_filename, mime_type, status, created_at, stored_filename, size_bytes
      FROM documents
      WHERE id = $1 AND user_id = $2
      `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("GET /documents/:id error:", err);
    return res.status(500).json({ error: "Failed to fetch document" });
  }
});
router.get("/:id/download", requireUser, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT original_filename, stored_filename
      FROM documents
      WHERE id = $1 AND user_id = $2
      `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    const { original_filename, stored_filename } = result.rows[0];
    const filepath = path.join(UPLOADS_DIR, stored_filename);

    return res.download(filepath, original_filename);
  } catch (err) {
    console.error("GET /documents/:id/download error:", err);
    return res.status(500).json({ error: "Failed to download document" });
  }
});
export default router;
