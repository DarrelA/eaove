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
    // Upvote button for user to award creator with 10 karma points after completing the challenge
    // Downvote button for user to fine 20 karma points from creator if
    // creator fail to donate the pledged amount OR
    // creator make a chargeback after receiving the upvote
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
