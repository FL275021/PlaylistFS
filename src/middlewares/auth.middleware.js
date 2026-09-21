import catchAsync from '../utils/catchAsync.js';
import { constructorError } from '../utils/constructor.error.js';
import { verifyAccessToken } from '../utils/token.util.js';
import User from '../models/User.js';

export const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(constructorError('No se recibió token. Por favor inicia sesión.', 401));
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    return next(constructorError('Token inválido o expirado. Por favor inicia sesión de nuevo.', 401));
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(constructorError('El usuario de este token ya no existe.', 401));
  }

  req.user = currentUser;
  next();
});
