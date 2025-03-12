const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { errorMessage } = require('../utils/error-messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: 'You must enter a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  income: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator(value) {
        return typeof value === 'number' && !isNaN(value);
      },
      message: 'Income must be a valid number',
    },
  },
  status: {
    type: String,
    required: true,
    enum: ['single', 'married'],
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(errorMessage.incorrectEmailOrPassword));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Error(errorMessage.incorrectEmailOrPassword)
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
