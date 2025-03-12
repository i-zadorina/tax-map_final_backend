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
    income: Joi.number().required().min(0).messages({
      'number.min': 'The "income" field must be a positive number',
      'any.required': 'The "income" field must be filled in',
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
    income: Joi.number().required().min(0).messages({
      'number.min': 'The "income" field must be a positive number',
      'any.required': 'The "income" field must be filled in',
    }),
    status: Joi.string().valid('single', 'married').required(),
  }),
});
