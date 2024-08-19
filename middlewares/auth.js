const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../utils/config");
const { errorCode, errorMessage } = require('../utils/errors');

const handleAuthError = (res) => {
  res.status(errorCode.unauthorized).send({ message: errorMessage.authorizationRequired });
};

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};

module.exports=auth;