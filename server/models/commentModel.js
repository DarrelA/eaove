import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    comment: { type: String, trim: true, maxLength: 1500 },
    upvotes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
