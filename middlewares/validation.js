const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error('string.email');
};

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      'string.empty': 'The "Email" field must be filled in',
      'string.email': 'the "Email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "Password" field must be filled in',
    }),
    income: Joi.string().required().min(2).max(30).messages({
      'string.min': 'The minimum length of the "income" field is 2',
      'string.max': 'The maximum length of the "income" field is 30',
      'string.empty': 'The "income" field must be filled in',
    }),
    status: Joi.string().valid('single', 'married').required(),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      'string.empty': 'The "Email" field must be filled in',
      'string.email': 'the "Email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "Password" field must be filled in',
    }),
  }),
});

module.exports.validateDataUpdate = celebrate({
  body: Joi.object().keys({
    income: Joi.string().required().min(2).max(30).messages({
      'string.min': 'The minimum length of the "income" field is 2',
      'string.max': 'The maximum length of the "income" field is 30',
      'string.empty': 'The "income" field must be filled in',
    }),
    status: Joi.string().valid('single', 'married').required(),
  }),
});
