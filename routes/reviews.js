import express from "express";
import Review from "../models/Review.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

// Public: get reviews
router.get("/", async (req, res) => {
  const reviews = await Review.find({ approved: true })
    .populate("patient", "name")
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// Patient: add review
router.post("/", auth, allowRoles("patient"), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      patient: req.user._id,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
