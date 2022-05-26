import express from 'express';
import { fetchPassportUserData, logout } from '../controller/userController.js';

const router = express.Router();

router.get('/passport_user', fetchPassportUserData);
router.post('/logout', logout);

export default router;
