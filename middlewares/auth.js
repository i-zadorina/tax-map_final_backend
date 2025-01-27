const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization === "Bearer null" || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError("User isn't logged in");
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError("Invalid token");
  }

  req.user = payload;

  return next();
};

module.exports=auth;