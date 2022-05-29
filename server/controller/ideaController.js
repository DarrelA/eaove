import { HttpError, Idea } from '../models/index.js';

const newIdea = async (req, res, next) => {
  const { title, description, tags } = req.body;
  if (!title) return next(new HttpError('Please provide a title', 400));
  if (title.length > 150)
    return next(new HttpError('Please keep within 150 characters.', 400));

  if (tags.split(',').length > 5)
    return next(new HttpError('Please keep it within a maximum of 5 tags', 400));

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
    const idea = await Idea.find({}).populate('creator', 'name');
    return res.status(200).send(idea);
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

export { newIdea, getAllIdeas };
