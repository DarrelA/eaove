const authMiddleware = async (req, res, next) =>
  !req.user ? res.status(401).send({ error: 'Please authenticate' }) : next();

export default authMiddleware;
