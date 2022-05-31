import express from 'express';
import {
  getAllIdeas,
  newIdea,
  voteIdea,
  updateIdea,
  deleteIdea,
} from '../controller/ideaController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/ideas', getAllIdeas);

router.post('/newidea', authMiddleware, newIdea);
router.post('/voteidea', authMiddleware, voteIdea);

router.patch('/updateidea', authMiddleware, updateIdea);

router.delete('/deleteidea/:ideaid', authMiddleware, deleteIdea);

export default router;
