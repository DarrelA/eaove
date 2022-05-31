import express from 'express';
import {
  getAllIdeas,
  getIdeasByTags,
  getIdeaChallengers,
  newIdea,
  voteIdea,
  acceptIdeaChallenge,
  updateIdea,
  deleteIdea,
} from '../controller/ideaController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/ideas', getAllIdeas);
router.get('/ideas/:tag', getIdeasByTags);
router.get('/:ideaid/challengers', getIdeaChallengers);

router.post('/newidea', authMiddleware, newIdea);
router.post('/voteidea', authMiddleware, voteIdea);
router.post('/acceptideachallenge/:ideaid', authMiddleware, acceptIdeaChallenge);

router.patch('/updateidea', authMiddleware, updateIdea);

router.delete('/deleteidea/:ideaid', authMiddleware, deleteIdea);

export default router;
