const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Criminal = require("../models/Criminal");
const { requireAuth, requireAdmin } = require("./middleware");
const { getEmbedding } = require("../services/faceService");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const THRESHOLD = Number(process.env.MATCH_THRESHOLD || 0.3);

function cosineScore(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dot / denominator;
}

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "forensight" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

router.post("/upload", requireAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });

    const sexFilter = String(req.body.sex_filter || "").trim();
    const embedding = await getEmbedding(req.file.buffer);
    if (!embedding) return res.status(400).json({ error: "Face not detected" });

    const query = { embedding: { $exists: true } };
    if (sexFilter) query.sex = { $regex: `^${escapeRegex(sexFilter)}$`, $options: "i" };

    const criminals = await Criminal.find(query).select("+embedding").lean();
    const results = [];

    for (const criminal of criminals) {
      if (!criminal.embedding?.length) continue;
      const score = cosineScore(embedding, criminal.embedding);
      results.push({
        name: criminal.name,
        age: criminal.age,
        sex: criminal.sex,
        crime: criminal.crime,
        status: criminal.status,
        imageURL: criminal.imageURL,
        score,
        is_match: score >= THRESHOLD,
      });
    }

    results.sort((a, b) => b.score - a.score);
    res.json({ matches: results.slice(0, 12) });
  } catch (err) {
    console.error("Face search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/enroll", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });

    const embedding = await getEmbedding(req.file.buffer);
    if (!embedding) return res.status(400).json({ message: "Face not detected" });

    const imageURL = await uploadToCloudinary(req.file.buffer);
    const age = Number(req.body.age);
    const height = Number(req.body.height);
    const weight = Number(req.body.weight);

    await Criminal.create({
      name: String(req.body.name || "").trim(),
      age: Number.isFinite(age) ? age : undefined,
      sex: String(req.body.sex || "").trim(),
      address: String(req.body.address || "").trim(),
      height: Number.isFinite(height) ? height : undefined,
      weight: Number.isFinite(weight) ? weight : undefined,
      crime: String(req.body.crime || "").trim(),
      status: String(req.body.status || "ARRESTED").trim(),
      imageURL,
      embedding,
    });

    res.status(201).json({ message: "Added" });
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/latest-criminals", async (req, res) => {
  try {
    const limit = clampInt(req.query.limit, 10, 1, 50);
    let criminals;

    if (["1", "true", "yes"].includes(String(req.query.random || "").toLowerCase())) {
      criminals = await Criminal.aggregate([
        { $match: { imageURL: { $exists: true, $ne: "" } } },
        { $sample: { size: limit } },
        { $project: { embedding: 0 } },
      ]);
    } else {
      criminals = await Criminal.find({})
        .select("-embedding")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    }

    res.json({ criminals });
  } catch (err) {
    console.error("Latest criminals error:", err);
    res.status(503).json({ message: "Database not reachable" });
  }
});

router.get("/members", requireAuth, async (req, res) => {
  try {
    const name = String(req.query.name || "").trim();
    const sex = String(req.query.sex || "").trim();
    const limit = clampInt(req.query.limit, 50, 1, 100);

    if (!name) return res.status(400).json({ message: "Missing name" });

    const query = { name: { $regex: escapeRegex(name), $options: "i" } };
    if (sex) query.sex = { $regex: `^${escapeRegex(sex)}$`, $options: "i" };

    const members = await Criminal.find(query)
      .select("-embedding")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ members });
  } catch (err) {
    console.error("Members error:", err);
    res.status(503).json({ message: "Database not reachable" });
  }
});

function clampInt(value, fallback, min, max) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = { router };
