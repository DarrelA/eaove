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
    // Based on the number of user's post upvotes
    karma: { type: Number, required: true, default: 0 },

    // Based on the amount of Eaove coins donated to the community
    // Users may purchase Eaove coins from store
    // Users may exchange Eaove coins for real money in currency of their choice
    // Or they can donate the coins to the community
    generosity: { type: Number, required: true, default: 0 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
