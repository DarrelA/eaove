import express from 'express';
import {
  newComment,
  getAllChallengersComments,
  getAllComments,
} from '../controller/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:ideaId', getAllComments);
router.get('/challengers/:ideaId', getAllChallengersComments);

router.post('/newcomment', newComment);

export default router;
