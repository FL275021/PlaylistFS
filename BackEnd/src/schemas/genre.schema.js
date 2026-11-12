import Joi from 'joi';

export const createGenreSchema = Joi.object({
  name: Joi.string().min(2).max(50).label('nombre').required(),
  description: Joi.string().max(300).allow('').label('descripción').optional(),
});

export const updateGenreSchema = Joi.object({
  name: Joi.string().min(2).max(50).label('nombre').optional(),
  description: Joi.string().max(300).allow('').label('descripción').optional(),
}).min(1);
