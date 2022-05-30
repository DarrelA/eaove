import { HttpError, Idea } from '../models/index.js';

const newIdea = async (req, res, next) => {
  const { title, description, tags } = req.body;
  if (!title) return next(new HttpError('Please provide a title', 400));
  if (title.length > 150)
    return next(new HttpError('Please keep within 150 characters.', 400));

  if (tags.split(',').length > 5)
    return next(new HttpError('Please keep it within a maximum of 5 tags', 400));

  // @TODO Add validation for tag's length

  if (title.length > 3000)
    return next(new HttpError('Please keep within 3000 characters.', 400));

  try {
    const idea = await Idea.create({
      creator: req.user._id,
      title,
      description,
      tags: tags.replace(/\s/g, '').split(','), // remove whitespace & convert str to array
    });

    await idea.save();
    return res.status(201).send({ message: 'success' });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const getAllIdeas = async (req, res, next) => {
  try {
    if (req.user) {
      const ideas = await Idea.find({}).populate('creator', 'name');
      ideas.forEach((idea) => {
        idea.upvotes = idea.upvotes.filter((id) => String(id) === String(req.user._id));
        idea.downvotes = idea.downvotes.filter(
          (id) => String(id) === String(req.user._id)
        );
      });
      return res.status(200).send(ideas);
    } else {
      const ideas = await Idea.find({})
        .select('-upvotes -downvotes')
        .populate('creator', 'name');
      return res.status(200).send(ideas);
    }
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const voteIdea = async (req, res, next) => {
  const idea = await Idea.findById(req.body.ideaId);
  if (!idea) return next(new HttpError('Idea not found.', 400));
  if (!req.body.vote) return next(new HttpError('Please cast your vote.', 400));

  // Ensure each user can only cast a single vote which is either upvote or downvote
  const upvotedByUser = idea.upvotes.filter((id) => String(id) === String(req.user._id));
  const downvotedByUser = idea.downvotes.filter(
    (id) => String(id) === String(req.user._id)
  );

  try {
    if (req.body.vote === 'upvote') {
      if (downvotedByUser.length === 1) {
        idea.downvotes = idea.downvotes.filter(
          (id) => String(id) !== String(req.user._id)
        );
        idea.downvotesCount--;
      }
      if (upvotedByUser.length === 0) {
        idea.upvotes.push(req.user._id);
        idea.upvotesCount++;
      } else {
        idea.upvotes = idea.upvotes.filter((id) => String(id) !== String(req.user._id));
        idea.upvotesCount--;
      }
    } else if (req.body.vote === 'downvote') {
      if (upvotedByUser.length === 1) {
        idea.upvotes = idea.upvotes.filter((id) => String(id) !== String(req.user._id));
        idea.upvotesCount--;
      }
      if (downvotedByUser.length === 0) {
        idea.downvotes.push(req.user._id);
        idea.downvotesCount++;
      } else {
        idea.downvotes = idea.downvotes.filter(
          (id) => String(id) !== String(req.user._id)
        );
        idea.downvotesCount--;
      }
    }

    await idea.save();
    return res.status(201).send({ message: 'success' });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateIdea = async (req, res, next) => {
  const { title, description, tags } = req.body;

  if (!title) return next(new HttpError('Please provide a title.', 400));
  if (title.length > 150)
    return next(new HttpError('Please keep within 150 characters.', 400));

  if (tags.split(',').length > 5)
    return next(new HttpError('Please keep it within a maximum of 5 tags', 400));

  // @TODO Add validation for tag's length

  if (description.length > 3000)
    return next(new HttpError('Please keep within 3000 characters.', 400));

  try {
    let idea = await Idea.findOne({ _id: req.body.ideaId, creator: req.user._id });
    if (!idea) return next(new HttpError('No idea', 400));

    if (title) idea.title = title;
    if (description) idea.description = description;
    if (tags) idea.tags = tags.replace(/\s/g, '').split(','); // remove whitespace & convert str to array

    await idea.save();
    return res.status(201).send({ message: 'success' });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

export { newIdea, getAllIdeas, voteIdea, updateIdea };
