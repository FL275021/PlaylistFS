import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).label('nombre de usuario').required(),
  email: Joi.string().email().label('email').required(),
  password: Joi.string().min(8).max(50).label('contraseña').required(),
});

// identifier acepta username o email
export const loginSchema = Joi.object({
  identifier: Joi.string().label('usuario o email').required(),
  password: Joi.string().label('contraseña').required(),
});
