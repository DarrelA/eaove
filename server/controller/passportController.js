import passport from 'passport';
import HttpError from '../models/http-error.js';
import User from '../models/userModel.js';

const googleRedirect = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

const googleCallback = passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/register',
});

const passportLogout = (req, res) => {
  try {
    req.logout(req.user, (err) => {
      if (err) return next(err);
      req.session.destroy();
      res.clearCookie('connect.sid').send({ message: 'Logged out' });
    });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const fetchPassportUserData = async (req, res, next) => {
  try {
    if (req.user) {
      const { _id, name, isAdmin } = req.user; // From passport
      const user = await User.findById(_id); // From db
      res.send({
        _id: _id,
        name: name,
        isAdmin: isAdmin,
        avatar: user.avatar || '',
      });
    } else return next(new HttpError('User not found.', 404));
  } catch (e) {
    console.log(e);
  }
};

export { googleRedirect, googleCallback, passportLogout, fetchPassportUserData };
