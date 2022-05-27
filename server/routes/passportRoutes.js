import express from 'express';
import {
  fetchPassportUserData,
  googleCallback,
  googleRedirect,
  passportLogout,
} from '../controller/passportController.js';

const router = express.Router();

router.get('/google', googleRedirect);
router.get('/google/callback', googleCallback);
router.get('/passport_user', fetchPassportUserData);
router.post('/logout', passportLogout);

export default router;
