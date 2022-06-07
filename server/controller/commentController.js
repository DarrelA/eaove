import { HttpError, Idea, Comment } from '../models/index.js';

const newComment = async (req, res, next) => {
  const { ideaId, comment, basicComment, commentId } = req.body;

  if (!comment || comment.length > 1500)
    return next(new HttpError('Please keep it within 1500 characters.', 400));

  try {
    const newComment = await Comment.create({ user: req.user._id, comment });
    const savedComment = await newComment.save();

    const idea = await Idea.findById(ideaId);

    if (commentId) {
      const replyToComment = await Comment.findById(commentId);
      if (!replyToComment) return next(new HttpError('Comment not found.', 400));
      replyToComment.replies.push(savedComment._id);
      await replyToComment.save();
    } else if (basicComment) {
      idea.comments.push(savedComment._id);
      idea.commentsCount++;
    } else {
      // @TODO: Validation to limit posting rights to creator & challenger only

      idea.challengersComments.push(savedComment._id);
      idea.challengersCommentsCount++;
    }

    await idea.save();
    return res.status(201).send({ message: 'success' });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Idea.findById(req.params.ideaId)
      .select('comments challengersComments')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' },
        populate: { path: 'replies' },
      })
      .populate({
        path: 'challengersComments',
        populate: { path: 'user', select: 'name' },
        populate: { path: 'replies' },
      });

    return res.status(200).send(comments);
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

export { newComment, getAllComments };
