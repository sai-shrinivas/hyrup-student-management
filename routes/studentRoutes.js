import express from "express";
import {
  getAllStudents,
  getStudentById,
  deleteStudent,
} from "../controllers/studentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin only
router.get("/", protect, authorizeRoles("admin"), getAllStudents);
router.delete("/:id", protect, authorizeRoles("admin"), deleteStudent);

// Logged in users
router.get("/:id", protect, getStudentById);

export default router;
