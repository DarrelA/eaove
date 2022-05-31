import mongoose from 'mongoose';

const ideaSchema = mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, trim: true, required: true, maxLength: 150 },
    description: { type: String, trim: true, maxLength: 3000 },
    tags: [String],
    upvotes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    upvotesCount: { type: Number, default: 0 },
    downvotes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    downvotesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    commentsCount: { type: Number, default: 0 },
    challengeOpen: { type: Boolean, default: true },
    challengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    challengersComments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    challengersCount: { type: Number, default: 0 },
    challengersCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    completedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;
