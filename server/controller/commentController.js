import { HttpError, Idea, Comment } from '../models/index.js';

const newComment = async (req, res, next) => {
  const { ideaId, comment, basicComment } = req.body;

  if (!comment || comment.length > 1500)
    return next(new HttpError('Please keep it within 1500 characters.', 400));

  try {
    const newComment = await Comment.create({ user: req.user._id, comment });
    const savedComment = await newComment.save();

    const idea = await Idea.findById(ideaId);

    if (basicComment) {
      idea.comments.push(savedComment._id);
      idea.commentsCount++;
    } else {
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
      .populate({ path: 'comments', populate: { path: 'user', select: 'name' } })
      .populate({
        path: 'challengersComments',
        populate: { path: 'user', select: 'name' },
      });

    return res.status(200).send(comments);
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

export { newComment, getAllComments };
