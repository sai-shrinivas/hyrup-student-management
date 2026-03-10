import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// ----- Publicly accessible to logged-in users -----

// Get all users (automatically handles search, pagination, and filtering)
router.get("/", protect, getUsers);

// Get a single user by their ID
router.get("/:id", protect, getUserById);

// ----- Restricted to Admins -----

// Create a new user manually
router.post("/", protect, authorizeRoles("admin"), createUser);

// Update a user's details
router.put("/:id", protect, authorizeRoles("admin"), updateUser);

// Delete a user
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
