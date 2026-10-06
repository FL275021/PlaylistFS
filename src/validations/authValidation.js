const Joi = require('joi');

exports.registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// identifier: accepts either username or email
exports.loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    'any.required': 'Username or email is required',
  }),
  password: Joi.string().required(),
});