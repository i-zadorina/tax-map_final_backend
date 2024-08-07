const User = require('../models/user');
const { errorCode, errorMessage } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(errorCode.defaultError).send({ message: errorMessage.defaultError });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({data: user}))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(errorCode.idNotFound).send({ message: errorMessage.idNotFound });
      } if (err.name === 'CastError') {
        return res.status(errorCode.invalidData).send({ message: errorMessage.invalidData });
      }
        return res.status(errorCode.defaultError).send({ message: errorMessage.defaultError});
      });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar){
    return res.status(errorCode.invalidData).send({ message:errorMessage.invalidData})
  }
  return User.create({ name, avatar })
    .then((user) => res.status(201).send({data: user}))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(errorCode.invalidData).send({ message: errorMessage.validationError });
      }
      return res.status(errorCode.defaultError).send({ message: errorMessage.defaultError });
    });
};

module.exports = { getUsers, getUserById, createUser };
