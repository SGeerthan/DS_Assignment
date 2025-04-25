import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserProfile,
  updateUser,
  deleteUser,
  uploadProfilePicture,
  uploadRestaurantImages,
  updateUserRole
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { upload } from "../helper/cloudinarySetUp.js";

const router = express.Router();

/* ---------- Public ---------- */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* ---------- Protected ---------- */
router.get("/", protect, adminOnly, getUsers);     // admin list users
router.get("/profile", protect, getUserProfile);
router.put("/update", protect, updateUser);
router.post("/upload-profile", protect, upload.single("profilePicture"), uploadProfilePicture);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

/* ---------- NEW : restaurant images (multiple) ---------- */
router.post(
  "/upload-restaurant",
  protect,
  upload.array("images", 5),          // up to 5 at once
  uploadRestaurantImages
);

export default router;
