import Student from "../models/userModel.js";
import imagekit from "../config/imagekit.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// Creating token to save user session
const createToken = (student) => {
  return jwt.sign(
    {
      id: student._id,
      role: student.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

const signup = async (req, res) => {
  try {
    // Collecting user data from request body
    const {
      name,
      email,
      password,
      studentId,
      course,
      year,
      gpa,
      phone,
      address,
      emergencyContact,
      avatar,
      role,
      enrollmentDate,
    } = req.body;

    // Checking the received data
    if (
      !name ||
      !email ||
      !password ||
      !studentId ||
      !course ||
      !year ||
      !phone ||
      !address ||
      !emergencyContact?.name ||
      !emergencyContact?.phone
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingStudent = await Student.findOne({
      $or: [{ email }, { studentId }],
    });

    if (existingStudent) {
      if (existingStudent.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      if (existingStudent.studentId === studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID already exists",
        });
      }
    }

    let avatarUrl = "";
    if (avatar) {
      // Upload avatar to ImageKit
      const uploadResponse = await imagekit.upload({
        file: avatar, // base64 encoded image string
        fileName: `avatar_${Date.now()}.jpg`,
        folder: "/hyrup-student-management",
      });
      avatarUrl = uploadResponse.url;
    }

    const student = await Student.create({
      name,
      email,
      password,
      studentId,
      course,
      year,
      gpa,
      phone,
      address,
      emergencyContact,
      avatar: avatarUrl,
      role,
      enrollmentDate,
    });

    const token = createToken(student);

    res.status(201).json({
      message: "User signed up successfully",
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        course: student.course,
        year: student.year,
        gpa: student.gpa,
        phone: student.phone,
        address: student.address,
        emergencyContact: student.emergencyContact,
        avatar: student.avatar,
        role: student.role,
        enrollmentDate: student.enrollmentDate,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Sign up not successful",
      success: false,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const student = await Student.findOne({ email }).select("+password");
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Email not registered",
      });
    }
    const isPasswordMatch = await student.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credetianls",
      });
    }

    const token = createToken(student);

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        course: student.course,
        year: student.year,
        gpa: student.gpa,
        phone: student.phone,
        address: student.address,
        emergencyContact: student.emergencyContact,
        avatar: student.avatar,
        role: student.role,
        enrollmentDate: student.enrollmentDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login not successful",
      success: false,
      error: error.message,
    });
  }
};

// Protected controller
const getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    res.status(200).json({
      message: "You are in the protected route",
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching data",
      success: false,
      error: error.message,
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const student = await Student.findById(userId).select("+password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const {
      name,
      email,
      course,
      year,
      gpa,
      phone,
      address,
      emergencyContact,
      avatar,
      currentPassword,
      newPassword,
    } = req.body;

    if (name) student.name = name;
    if (email) student.email = email;
    if (course) student.course = course;
    if (year) student.year = year;
    if (gpa) student.gpa = gpa;
    if (phone) student.phone = phone;
    if (address) student.address = address;
    if (emergencyContact) student.emergencyContact = emergencyContact;

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Both current and new passwords are required to change password",
        });
      }

      const isMatch = await student.comparePassword(currentPassword);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters long",
        });
      }

      student.password = newPassword; // will be hashed automatically
    }

    if (avatar) {
      const uploadResponse = await imagekit.upload({
        file: avatar,
        fileName: `avatar_${userId}_${Date.now()}.jpg`,
        folder: "/hyrup-student-management",
      });

      student.avatar = uploadResponse.url;
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        course: student.course,
        year: student.year,
        gpa: student.gpa,
        phone: student.phone,
        address: student.address,
        emergencyContact: student.emergencyContact,
        avatar: student.avatar,
        role: student.role,
        enrollmentDate: student.enrollmentDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { signup, login, getMe, editProfile };
