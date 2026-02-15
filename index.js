import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config(); //{ path: "./.env" });

const PORT = process.env.PORT;
//console.log(PORT);
const app = express();
app.use(express.json());
// connect to database
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL(Vite React) for CORS (data protection); use "*" to allow all origins
    credentials: true, // Enable cookies and other credentials in CORS requests
  }),
);
app.use("/api/student/auth", router); // use the auth routes with the "/api/auth" prefix
app.use("/api/v1/students", studentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" }); // "/" represents the home route
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
