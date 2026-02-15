# Student Management System - Backend

A secure and scalable Student Management System built using **Node.js, Express, MongoDB, and JWT Authentication**.

This project supports authentication, role-based authorization, and full student management with pagination and search functionality.

---

## Features

### Authentication

- Student & Admin Signup
- Secure Login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes

### Role-Based Authorization

- `student` and `admin` roles
- Admin-only access to certain routes
- Middleware-based access control

### Student Management

- Get all students (Admin only)
- Get single student
- Delete student (Admin only)
- Update student profile
- Pagination support
- Search functionality

### Advanced Features

- API versioning (`/api/v1`)
- Secure environment variables
- Modular project structure
- Proper error handling

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcrypt
- CORS
- ImageKit (for avatar uploads)

---

## Project Structure

Backend/
│
├── config/
│ ├── connectDB.js
│ └── imagekit.js
│
├── controllers/
│ ├── authController.js
│ └── studentController.js
│
├── middleware/
│ ├── authMiddleware.js
│ └── roleMiddleware.js
│
├── models/
│ └── userModel.js
│
├── routes/
│ ├── authRoutes.js
│ └── studentRoutes.js
│
├── index.js
├── .env
└── README.md
