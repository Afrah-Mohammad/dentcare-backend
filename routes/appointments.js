import express from "express";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

// Patient: book appointment
router.post("/", auth, allowRoles("patient"), async (req, res) => {
  try {
    const { serviceId, dentistId, appointmentTime } = req.body;

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(400).json({ message: "Invalid service" });
    }

    const dentist = await User.findById(dentistId);
    if (!dentist || dentist.role !== "dentist") {
      return res.status(400).json({ message: "Invalid dentist" });
    }

    const appt = await Appointment.create({
      patient: req.user._id,
      dentist: dentistId,
      service: serviceId,
      appointmentTime,
      fee: service.basePrice
    });

    res.status(201).json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Patient: my appointments
router.get("/me", auth, allowRoles("patient"), async (req, res) => {
  const appts = await Appointment.find({ patient: req.user._id })
    .populate("service", "name basePrice")
    .populate("dentist", "name")
    .sort({ appointmentTime: -1 });
  res.json(appts);
});

// Dentist: appointments assigned to them
router.get("/dentist", auth, allowRoles("dentist"), async (req, res) => {
  const appts = await Appointment.find({ dentist: req.user._id })
    .populate("patient", "name phone")
    .populate("service", "name")
    .sort({ appointmentTime: 1 });
  res.json(appts);
});

// Dentist: update status/notes
router.put("/:id/status", auth, allowRoles("dentist"), async (req, res) => {
  const { status, notes } = req.body;
  const appt = await Appointment.findOne({ _id: req.params.id, dentist: req.user._id });
  if (!appt) return res.status(404).json({ message: "Appointment not found" });

  if (status) appt.status = status;
  if (notes) appt.notes = notes;
  await appt.save();
  res.json(appt);
});

export default router;
