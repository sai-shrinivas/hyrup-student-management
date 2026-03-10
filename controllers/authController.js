import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken(user);

    res.status(201).json({
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // The model automatically deselects password, so we must explicitly select it
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await user.comparePassword(password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
