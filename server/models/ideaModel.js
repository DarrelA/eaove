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
    bounty: {
      currency: { type: String, maxLength: 3 },
      value: { type: Number, required: true, default: 0, min: 0, max: 50_000_000_000 },
      fundsTransferPlatform: { type: String, maxLength: 80 },
      edited: { type: Number, required: true, default: 0 },
      editedAt: [{ type: Date, default: Date.now }],
      timeLimit: {
        type: Date, // Default to 7 days time limit challenge
        default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
      },
    },
    challengeOpen: { type: Boolean, default: true },
    challengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    challengersCount: { type: Number, default: 0 },
    challengersCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    challengersCompletedCount: { type: Number, default: 0 },
    challengersComments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    challengersCommentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;
