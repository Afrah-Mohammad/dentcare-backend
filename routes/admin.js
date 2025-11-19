import express from "express";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.get("/stats", auth, allowRoles("admin"), async (req, res) => {
  const totalPatients = await User.countDocuments({ role: "patient" });
  const totalDentists = await User.countDocuments({ role: "dentist" });
  const totalAppointments = await Appointment.countDocuments();
  const revenueAgg = await Appointment.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, total: { $sum: "$fee" } } }
  ]);
  const revenue = revenueAgg[0]?.total || 0;

  res.json({ totalPatients, totalDentists, totalAppointments, revenue });
});

export default router;
