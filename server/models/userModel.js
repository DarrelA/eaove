import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    googleId: { type: String },
    avatar: { type: String },
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
