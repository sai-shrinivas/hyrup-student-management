import jwt from "jsonwebtoken";
import Student from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  // next refers to the next middleware or controller
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
  const token = authHeader.split(" ")[1]; // authHeader: ['Bearer', 'token'] so taking index 1
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Student.findById(decoded.id).select("-password"); // Select all fields except password
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }
    req.user = user; // attaching user to request object
    next(); // proceed to the next middleware or controller
  } catch (error) {
    return res.status(401).json({
      message: "Token verification failed, Invalid/Expired Token",
      success: false,
      error: error.message,
    });
  }
};
