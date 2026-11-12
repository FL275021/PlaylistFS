import Joi from 'joi';

// Valida que los parámetros de ruta que contienen un ID de MongoDB tengan el formato correcto.
export const paramsIdSchema = (paramName) =>
  Joi.object({
    [paramName]: Joi.string()
      .hex()
      .length(24)
      .label(paramName)
      .required(),
  });
