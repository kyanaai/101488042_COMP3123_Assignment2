import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // _id is auto by default
    username: { type: String, required: true, trim: true, unique: true },
    email:    { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true } // hashed
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

export default mongoose.model("User", UserSchema);