const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { errorCode, errorMessage } = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(errorCode.invalidData)
      .send({ message: errorMessage.requiredEmail });
  }
  User.findOne({ email }).select("+password")
    .then((existingEmail) => {
      if (existingEmail) {
        const error = new Error('Email already exists');
        error.code = 11000;
        error.name = "DuplicateError";
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({ name, avatar, email, password: hash })
        .then((matched) => {
          if (!matched) {
            // the hashes didn't match, rejecting the promise
            return Promise.reject(new Error('Incorrect password or email'));
          }
          // successful authentication
          res.send({ message: 'Everything good!' }); // or token
        })
        .then((user) => res.send({
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          // data: user
        }))
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "DuplicateError" || err.code === 11000) {
        return res.status(409).send({ message: 'Email already exist' });
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
      .status(400)
      .send({ message: "The email and password fields are required" });
  }
  return User.findUserByCredentials({email, password})
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(401)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

const getCurrentUser = (req, res) => {
  // const { userId } = req.params;
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ data: user }))
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
  const { name, avatar } = req.body;

//   const updates = {};
//   if (name) updates.name = name;
//   if (avatar) updates.avatar = avatar;

  User.findByIdAndUpdate(
    req.user._id, req.body,
//    updates,
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
  .orFail().then((user) => res.send({ data: user }))
//     .then((user) => {
//       if (!user) {
//       return res.status(404).send({ message: "user not found" });
//     }
//     return res.status(200).json({ data: user });})
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode.invalidData)
          .send({ message: errorMessage.validationError });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(errorCode.idNotFound)
          .send({ message: errorMessage.idNotFound });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
