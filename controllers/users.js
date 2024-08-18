const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { JWT_SECRET } = require('../utils/config');
const { errorCode, errorMessage } = require('../utils/errors');
const User = require('../models/user');

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res
      .status(errorCode.invalidData)
      .send({ message: errorMessage.requiredEmailAndPassword });
  }
  if (!validator.isEmail(email)) {
    return res
      .status(errorCode.invalidData)
      .send({ message: errorMessage.invalidEmail });
  }
  return User.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        const error = new Error('Email already exists');
        // error.code = 11000;
        // error.name = 'DuplicateError';
        throw error;
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
      if (err.message === 'Email already exists') {
        return res
          .status(errorCode.conflict)
          .send({ message: errorMessage.existEmail });
      }
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode.invalidData)
          .send({ message: errorMessage.validationError });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(errorCode.invalidData)
      .send({ message: errorMessage.requiredEmailAndPassword });
  }
  if (!validator.isEmail(email)) {
    return res
      .status(errorCode.invalidData)
      .send({ message: errorMessage.invalidEmail });
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
        return res
          .status(errorCode.unauthorized)
          .send({ message: errorMessage.incorrectEmailOrPassword });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      if (!user) {
        return res
          .status(errorCode.idNotFound)
          .send({ message: errorMessage.idNotFound });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(errorCode.idNotFound)
          .send({ message: errorMessage.idNotFound });
      }
      if (err.name === 'CastError') {
        return res
          .status(errorCode.invalidData)
          .send({ message: errorMessage.invalidData });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
    .orFail(() => new Error('DocumentNotFoundError'))
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(errorCode.idNotFound).send({
          message: errorMessage.idNotFound,
        });
      }
      return res.status(200).json({ data: updatedUser });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(errorCode.invalidData).json({ message: errorMessage.validationError });
      }
      if (err.message === 'DocumentNotFoundError') {
        return res.status(errorCode.idNotFound).json({ message: errorMessage.idNotFound });
      }
      return res.status(errorCode.defaultError).json({ message: errorMessage.defaultError });
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
