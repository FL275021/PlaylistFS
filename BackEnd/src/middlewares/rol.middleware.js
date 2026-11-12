import { constructorError } from '../utils/constructor.error.js';

// Fábrica: devuelve un middleware que solo deja pasar al rol indicado.
const validarRol = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return next(constructorError('No tienes permisos suficientes para realizar esta acción.', 403));
  }
  next();
};

export const soloAdmin = validarRol('admin');

// Para rutas que aceptan varios roles: soloRoles('admin', 'user')
export const soloRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(constructorError('No tienes permisos suficientes para realizar esta acción.', 403));
  }
  next();
};
