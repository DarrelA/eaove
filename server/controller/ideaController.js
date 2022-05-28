import { HttpError, Idea } from '../models/index.js';

const newIdea = async (req, res, next) => {
  const { title, description, tags } = req.body;
  if (!title) return next(new HttpError('Please provide a title', 400));

  try {
    const idea = await Idea.create({
      creator: req.user._id,
      title,
      description,
      tags,
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
    const idea = await Idea.find({}).populate('creator', 'name');
    return res.status(200).send(idea);
  } catch (e) {
    return next(new HttpError('Something went wrong!', 500));
  }
};

export { newIdea, getAllIdeas };
