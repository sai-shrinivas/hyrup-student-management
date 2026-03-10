import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    gpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        match: [/^[0-9]{10}$/, "Invalid phone number"],
      },
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["student", "admin", "teacher"],
      default: "student",
    },

    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;

  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
