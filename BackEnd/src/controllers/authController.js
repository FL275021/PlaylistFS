import catchAsync from '../utils/catchAsync.js';
import { constructorError } from '../utils/constructor.error.js';
import User from '../models/User.js';
import { hashear, compararPassword } from '../utils/hash.util.js';
import { generarAccessTokenByUser } from '../utils/token.util.js';
import sanitizeUser from '../utils/sanitizeUser.js';
import { Role } from '../constants/role.constants.js';
import { Plan } from '../constants/plan.constants.js';

export const register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existente = await User.findOne({ $or: [{ username }, { email }] });
  if (existente) {
    const campo = existente.username === username ? 'nombre de usuario' : 'email';
    return next(constructorError(`Ese ${campo} ya está registrado.`, 409));
  }

  // El rol y el plan nunca vienen del cliente — siempre 'user' / 'plus' en el registro.
  const passwordHash = await hashear(password);
  const user = await User.create({
    username,
    email,
    password: passwordHash,
    role: Role.user,
    plan: Plan.plus,
  });

  const token = generarAccessTokenByUser(user);

  res.status(201).json({ status: 'success', token, data: { user: sanitizeUser(user) } });
});

export const login = catchAsync(async (req, res, next) => {
  const { identifier, password } = req.body;
  const errorCredencial = constructorError('Credenciales inválidas.', 401);

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  }).select('+password');

  if (!user) return next(errorCredencial);

  const valido = await compararPassword(password, user.password);
  if (!valido) return next(errorCredencial);

  const token = generarAccessTokenByUser(user);

  res.status(200).json({ status: 'success', token, data: { user: sanitizeUser(user) } });
});

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({ status: 'success', data: { user: sanitizeUser(req.user) } });
});
