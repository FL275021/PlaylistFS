import Joi from 'joi';

export const updateMeSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).label('nombre de usuario').optional(),
  email: Joi.string().email().label('email').optional(),
}).min(1);
