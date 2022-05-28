import express from 'express';
import { getAllIdeas, newIdea } from '../controller/ideaController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/newidea', authMiddleware, newIdea);
router.get('/ideas', getAllIdeas);

export default router;
