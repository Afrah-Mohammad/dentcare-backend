import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    approved: { type: Boolean, default: true } // keep auto-approved for simplicity
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
