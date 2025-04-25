import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,

    email: { type: String, unique: true },

    profilePicture: { type: String, default: "" },

    // NEW : restaurant owners can keep images here (array, optional)
    restaurantImages: { type: [String], default: [] },

    dateOfBirth: Date,

    role: {
      type: String,
      enum: ["admin", "taxpayer", "restaurantOwner", "deliveryPerson"],
      default: "taxpayer"
    },

    hashed_password: { type: String, required: true }
  },
  { timestamps: true }
);

// hash on save
userSchema.pre("save", async function (next) {
  if (!this.isModified("hashed_password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.hashed_password = await bcrypt.hash(this.hashed_password, salt);
  next();
});

export const User = mongoose.model("User", userSchema);
