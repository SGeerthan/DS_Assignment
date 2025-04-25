import { User } from "../models/userModel.js";
import { imageUploadUnit } from "../helper/cloudinarySetUp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../config.js";

// Generate JWT Token
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

/* ------------------------------------------------------------------ */
/*             PROFILE PICTURE (single) – unchanged                   */
/* ------------------------------------------------------------------ */
export const uploadProfilePicture = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUnit(url);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated",
      url: result.secure_url
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ success: false, message: "Error uploading image" });
  }
};

/* ------------------------------------------------------------------ */
/*  NEW : RESTAURANT OWNER MULTI-IMAGE UPLOAD                          */
/* ------------------------------------------------------------------ */
export const uploadRestaurantImages = async (req, res) => {
  try {
    // role check
    if (req.user.role !== "restaurantOwner")
      return res.status(403).json({ message: "Only restaurant owners can upload" });

    const files = req.files || [];
    if (!files.length) return res.status(400).json({ message: "No files provided" });

    const uploaded = [];
    for (const file of files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const url = `data:${file.mimetype};base64,${b64}`;
      const out = await imageUploadUnit(url);
      uploaded.push(out.secure_url);
    }

    const owner = await User.findById(req.user.id);
    owner.restaurantImages.push(...uploaded);
    await owner.save();

    res.status(200).json({ success: true, urls: uploaded });
  } catch (e) {
    console.error("Restaurant image upload error:", e);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

/* ------------------------------------------------------------------ */
/*                       REGISTER – unchanged                         */
/* ------------------------------------------------------------------ */
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, dateOfBirth, role, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "User already exists" });

    const newUser = new User({
      firstName,
      lastName,
      email,
      dateOfBirth,
      role: role === "admin" ? "taxpayer" : role, // keep your logic
      hashed_password: password
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(newUser),
      user: {
        id: newUser._id,
        firstName,
        lastName,
        email,
        profilePicture: newUser.profilePicture,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ------------------------------------------------------------------ */
/*                       LOGIN – unchanged                            */
/* ------------------------------------------------------------------ */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------------- other handlers (getUsers, updateUser,… unchanged)  */

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-hashed_password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-hashed_password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;

    if (req.body.email && req.body.email !== user.email) {
      if (await User.findOne({ email: req.body.email }))
        return res.status(400).json({ message: "Email is already in use" });
      user.email = req.body.email;
    }

    if (req.body.dateOfBirth) {
      const dob = new Date(req.body.dateOfBirth);
      if (isNaN(dob)) return res.status(400).json({ message: "Invalid date" });
      user.dateOfBirth = dob;
    }

    if (req.body.password)
      user.hashed_password = await bcrypt.hash(req.body.password, 10);

    await user.save();
    const { hashed_password, ...clean } = user.toObject();
    res.status(200).json({ message: "User updated successfully", user: clean });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: "Role is required" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();
    res.status(200).json({ message: "User role updated", role: user.role });
  } catch (e) {
    console.error("Update Role Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

/* ------------------------------------------------------------------ */
/*          EXPORT new function so route can use it                    */
/* ------------------------------------------------------------------ */
// export {
//   uploadRestaurantImages   // <-- add this to your routes
// };
