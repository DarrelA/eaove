import { HttpError, Idea } from '../models/index.js';

const newIdea = async (req, res, next) => {
  const { title, description, tags, bounty, currency, fundsTransferPlatform } = req.body;

  if (!title) return next(new HttpError('Please provide a title.', 400));
  if (title.length > 150)
    return next(new HttpError('Please keep within 150 characters.', 400));

  if (tags.split(',').length > 5)
    return next(new HttpError('Please keep it within a maximum of 5 tags', 400));

  // @TODO Add validation for tag's length

  if (title.length > 3000)
    return next(new HttpError('Please keep within 3000 characters.', 400));

  if (bounty > 0 && !currency)
    return next(new HttpError('Please provide the currency.', 400));

  if (bounty > 0 && !fundsTransferPlatform)
    return next(
      new HttpError(
        'Please provide the name of the platform that you will be using for fund transfer e.g. PayPal.',
        400
      )
    );

  const bountyObj = { currency, value: bounty, fundsTransferPlatform };

  try {
    const idea = await Idea.create({
      creator: req.user._id,
      title,
      description,
      tags: tags.toLowerCase().replace(/\s/g, '').split(','), // remove whitespace & convert str to array
      bounty: bountyObj,
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

const getIdeasByTags = async (req, res, next) => {
  try {
    if (req.user) {
      const ideas = await Idea.find({ tags: `${req.params.tag}` }).populate(
        'creator',
        'name'
      );
      ideas.forEach((idea) => {
        idea.upvotes = idea.upvotes.filter((id) => String(id) === String(req.user._id));
        idea.downvotes = idea.downvotes.filter(
          (id) => String(id) === String(req.user._id)
        );
      });

      if (!ideas) return next(new HttpError('Idea not found.', 400));

      return res.status(200).send(ideas);
    } else {
      const ideas = await Idea.find({ tags: `${req.params.tag}` })
        .select('-upvotes -downvotes')
        .populate('creator', 'name');

      if (!ideas) return next(new HttpError('Idea not found.', 400));
      return res.status(200).send(ideas);
    }
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const getIdeaChallengers = async (req, res, next) => {
  try {
    const ideas = await Idea.findById(req.params.ideaid)
      .select('challengers challengersCompleted')
      .populate('challengers', 'name');

    return res.status(200).send(ideas);
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

const acceptIdeaChallenge = async (req, res, next) => {
  try {
    let idea = await Idea.findById(req.params.ideaid);
    if (!idea) return next(new HttpError('Idea not found.', 400));

    const completedByUser = idea.challengersCompleted.filter(
      (id) => String(id) === String(req.user._id)
    );

    if (completedByUser.length === 1)
      return next(
        new HttpError('You cannot reject the challenge after completion!', 400)
      );

    const challengedByUser = idea.challengers.filter(
      (id) => String(id) === String(req.user._id)
    );

    if (challengedByUser.length === 0) {
      idea.challengers.push(req.user._id);
      idea.challengersCount++;
    } else {
      idea.challengers = idea.challengers.filter(
        (id) => String(id) !== String(req.user._id)
      );
      idea.challengersCount--;
    }

    await idea.save();
    return res.status(201).send({ message: 'success' });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const completedIdeaChallenge = async (req, res, next) => {
  try {
    let idea = await Idea.findById(req.params.ideaid);
    if (!idea) return next(new HttpError('Idea not found.', 400));

    const challengedByUser = idea.challengers.filter(
      (id) => String(id) === String(req.user._id)
    );
    if (challengedByUser.length === 0)
      return next(new HttpError('You need to accept the challenge first!', 400));

    const completedByUser = idea.challengersCompleted.filter(
      (id) => String(id) === String(req.user._id)
    );

    if (completedByUser.length === 0) {
      idea.challengersCompleted.push(req.user._id);
      idea.completedCount++;
    } else {
      idea.challengersCompleted = idea.challengersCompleted.filter(
        (id) => String(id) !== String(req.user._id)
      );
      idea.completedCount--;
    }

    await idea.save();
    return res.status(201).send({ message: 'success' });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateIdea = async (req, res, next) => {
  // @TODO: Prevent edit when there is at least a challenger

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
    if (!idea) return next(new HttpError('Does the idea belongs to you?', 400));

    if (title) idea.title = title;
    idea.description = description;
    idea.tags = tags.replace(/\s/g, '').split(','); // remove whitespace & convert str to array

    await idea.save();
    return res.status(201).send({ message: 'success' });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const deleteIdea = async (req, res, next) => {
  // @TODO: Add validation to check if there is any challengers

  try {
    const idea = await Idea.findOneAndDelete({
      _id: req.params.ideaid,
      creator: req.user._id,
    });
    if (!idea) return next(new HttpError('Does the idea belongs to you?', 400));
    return res.status(201).send({ message: 'success' });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

export {
  getAllIdeas,
  getIdeasByTags,
  getIdeaChallengers,
  newIdea,
  voteIdea,
  acceptIdeaChallenge,
  completedIdeaChallenge,
  updateIdea,
  deleteIdea,
};
