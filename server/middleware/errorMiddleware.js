import HttpError from '../models/http-error.js';

const notFoundMiddleware = (req, res, next) =>
  next(new HttpError(`Not Found - ${req.originalUrl}`, 404));

const errorMiddleware = (err, req, res, next) => {
  // console.log(err);
  if (err.name === 'InternalOAuthError') return; // prevents cannot fetch user error when logging in
  if (res.headersSent) return next(err);
  try {
    res.status(err.code || 500).json({
      message: err.message || 'Something went wrong!',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  } catch (err) {
    console.log(err);
  }
};

export { notFoundMiddleware, errorMiddleware };
