const Joi = require('joi');

exports.createGenreSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(300).allow('').optional(),
});

exports.updateGenreSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  description: Joi.string().max(300).allow('').optional(),
}).min(1);