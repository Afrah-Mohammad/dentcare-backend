import express from "express";
import Service from "../models/Service.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

// Public: list services
router.get("/", async (req, res) => {
  const services = await Service.find({ isActive: true }).sort("name");
  res.json(services);
});

// Admin: create service
router.post("/", auth, allowRoles("admin"), async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: update service
router.put("/:id", auth, allowRoles("admin"), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
