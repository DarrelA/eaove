import express from 'express';
import {
  newComment,
  getAllChallengersComments,
  getAllComments,
} from '../controller/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllComments);
router.get('/challengers', authMiddleware, getAllChallengersComments);

router.post('/newcomment', newComment);

export default router;
