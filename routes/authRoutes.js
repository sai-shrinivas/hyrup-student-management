import express from "express";
import {
  login,
  signup,
  getMe,
  editProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router(); // create a router instance
router.post("/signup", signup); // define the signup route
router.post("/login", login); // define the login route
router.get("/me", protect, getMe); // define the protected route
router.patch("/profile", protect, editProfile); // define the edit profile route

export default router; // export the router as the default export
