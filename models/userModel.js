import mongoose from "mongoose";
import bcrypt from "bcrypt";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Ensure email uniqueness
    lowercase: true, // Convert email to lowercase before saving
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8, // Minimum length requirement for password
    select: false, // Exclude password from query results by default
  },
  studentId: {
    type: String,
    required: [true, "Student ID is required"],
    unique: true,
    trim: true,
  },
  course: {
    type: String,
    required: [true, "Course is required"],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, "Year of Study is required"],
    min: 1,
    max: 5,
  },
  gpa: {
    type: Number,
    min: 0.0,
    max: 10.0,
    default: 0.0,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
      trim: true,
    },
    // required: [true, "Emergency Contact details are required"],
  },
  avatar: {
    type: String,
    default: "", // Default avatar URL or path
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },

  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
});

// Pre save function to hash password automatically before saving
studentSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare entered password with hashed password
studentSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
const Student = mongoose.model("Student", studentSchema);
export default Student;
