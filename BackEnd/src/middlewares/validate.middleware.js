import { mensajesJoi } from '../config/joi-message.js';
import { constructorError } from '../utils/constructor.error.js';

// validate(schema) valida req[property] usando los mensajes en español de joi-message.js
export const validate = (schema, property = 'body') =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      messages: mensajesJoi,
      errors: { wrap: { label: false } },
    });

    if (error) {
      // Formato: { message: 'primer error; segundo error', errors: [{field, message}] }
      const errores = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      const mensaje = errores.map((e) => e.message).join('; ');
      return next(constructorError(mensaje, 400));
    }

    req[property] = value;
    next();
  };
