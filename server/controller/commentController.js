import { HttpError, Idea, Comment } from '../models/index.js';

const newComment = async (req, res, next) => {
  const { ideaId, comment } = req.body;

  if (!comment || comment.length > 1500)
    return next(new HttpError('Please keep it within 1500 characters.', 400));

  try {
    const newComment = await Comment.create({ user: req.user._id, comment });
    const savedComment = await newComment.save();

    const idea = await Idea.findById(ideaId);
    idea.comments.push(savedComment._id);
    idea.commentsCount++;
    await idea.save();
    return res.status(201).send({ message: 'success' });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const getAllComments = async (req, res, next) => {
  // try {
  //   if (req.user) {
  //     const ideas = await Idea.find({}).populate('creator', 'name');
  //     ideas.forEach((idea) => {
  //       idea.upvotes = idea.upvotes.filter((id) => String(id) === String(req.user._id));
  //       idea.downvotes = idea.downvotes.filter(
  //         (id) => String(id) === String(req.user._id)
  //       );
  //     });
  //     return res.status(200).send(ideas);
  //   } else {
  //     const ideas = await Idea.find({})
  //       .select('-upvotes -downvotes')
  //       .populate('creator', 'name');
  //     return res.status(200).send(ideas);
  //   }
  // } catch (e) {
  //   console.log(e);
  //   return next(new HttpError('Something went wrong!', 500));
  // }
};

const getAllChallengersComments = async (req, res, next) => {
  // try {
  //   if (req.user) {
  //     const ideas = await Idea.find({ tags: `${req.params.tag}` }).populate(
  //       'creator',
  //       'name'
  //     );
  //     ideas.forEach((idea) => {
  //       idea.upvotes = idea.upvotes.filter((id) => String(id) === String(req.user._id));
  //       idea.downvotes = idea.downvotes.filter(
  //         (id) => String(id) === String(req.user._id)
  //       );
  //     });
  //     if (!ideas) return next(new HttpError('Idea not found.', 400));
  //     return res.status(200).send(ideas);
  //   } else {
  //     const ideas = await Idea.find({ tags: `${req.params.tag}` })
  //       .select('-upvotes -downvotes')
  //       .populate('creator', 'name');
  //     if (!ideas) return next(new HttpError('Idea not found.', 400));
  //     return res.status(200).send(ideas);
  //   }
  // } catch (e) {
  //   console.log(e);
  //   return next(new HttpError('Something went wrong!', 500));
  // }
};

export { newComment, getAllComments, getAllChallengersComments };
