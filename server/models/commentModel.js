import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    comment: { type: String, trim: true, maxLength: 1500 },
    upvotes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    upvotesCount: { type: Number, default: 0 },
    downvotes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    downvotesCount: { type: Number, default: 0 },
    replies: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
