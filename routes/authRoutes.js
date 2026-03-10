import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Route to register a new user: POST /api/auth/register
router.post("/register", register);

// Route to login a user: POST /api/auth/login
router.post("/login", login);

export default router;
