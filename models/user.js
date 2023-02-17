const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, unique: true, required: true },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowerCase: true,
    },
    password: { type: String, required: true, minLength: 8 },
    token: { type: String },
    role: { type: String, enum: ["admin", "user", "writer"], default: "user" },
    profile_image: { type: String, default: "default.png" },

    // isEmailVerified: { type: Boolean, default: false },
    // verificationCode: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
