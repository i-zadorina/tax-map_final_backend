const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');
const { errorMessage } = require('../utils/error-messages');
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const ConflictError = require("../utils/errors/ConflictError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    throw new BadRequestError({ message: errorMessage.requiredEmailAndPassword });
  }
  if (!validator.isEmail(email)) {
    throw new BadRequestError({ message: errorMessage.invalidEmail });
  }
  return User.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        throw new Error('Email already exists');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res.send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "MongoServerError") {
        next(new ConflictError("User with this email already exists"));}
      else if (err.name === 'ValidationError') {
        next(new BadRequestError("Invalid data"));
      } else {
      next(err);}
    });
};

const login = (req, res,next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Invalid data");
  }
  if (!validator.isEmail(email)) {
    throw new BadRequestError(errorMessage.invalidEmail);
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Incorrect email or password') {
        next(new UnauthorizedError("Authentication error"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError({ message: errorMessage.NotFoundError }));
      } else if (err.name === 'CastError'|| err.name === "ValidationError") {
        next(new BadRequestError({ message: errorMessage.BadRequestError }));
      }else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => new Error('DocumentNotFoundError'))
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError" || err.name === "ValidationError") {
        next(new BadRequestError({ message: errorMessage.validationError }));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError({ message: errorMessage.NotFoundError }));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
