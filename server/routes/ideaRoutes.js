import express from 'express';
import {
  getAllIdeas,
  newIdea,
  voteIdea,
  updateIdea,
} from '../controller/ideaController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/ideas', getAllIdeas);
router.post('/newidea', authMiddleware, newIdea);
router.post('/voteidea', authMiddleware, voteIdea);
router.post('/updateidea', authMiddleware, updateIdea);

export default router;
