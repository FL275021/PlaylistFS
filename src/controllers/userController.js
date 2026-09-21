import catchAsync from '../utils/catchAsync.js';
import { constructorError } from '../utils/constructor.error.js';
import User from '../models/User.js';
import Playlist from '../models/Playlist.js';
import APIFeatures from '../utils/apiFeatures.js';
import sanitizeUser from '../utils/sanitizeUser.js';
import { Plan, PLUS_PLAYLIST_LIMIT } from '../constants/plan.constants.js';

export const upgradePlan = catchAsync(async (req, res, next) => {
  if (req.user.plan === Plan.premium) {
    return next(constructorError('Ya tienes el plan premium.', 400));
  }
  req.user.plan = Plan.premium;
  await req.user.save();
  res.status(200).json({ status: 'success', data: { plan: req.user.plan } });
});

// Endpoint dedicado para el widget de uso del frontend.
export const getUsage = catchAsync(async (req, res) => {
  const used = await Playlist.countDocuments({ owner: req.user._id });

  if (req.user.plan === Plan.plus) {
    return res.status(200).json({
      status: 'success',
      data: {
        plan: Plan.plus,
        used,
        limit: PLUS_PLAYLIST_LIMIT,
        percentageUsed: Math.round((used / PLUS_PLAYLIST_LIMIT) * 100),
      },
    });
  }

  res.status(200).json({
    status: 'success',
    data: { plan: Plan.premium, used, limit: null, percentageUsed: null },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;

  if (username || email) {
    const existente = await User.findOne({
      _id: { $ne: req.user._id },
      $or: [...(username ? [{ username }] : []), ...(email ? [{ email }] : [])],
    });
    if (existente) {
      const campo = existente.username === username ? 'nombre de usuario' : 'email';
      return next(constructorError(`Ese ${campo} ya está en uso.`, 409));
    }
  }

  if (username) req.user.username = username;
  if (email) req.user.email = email;
  await req.user.save();

  res.status(200).json({ status: 'success', data: { user: sanitizeUser(req.user) } });
});

export const deleteMe = catchAsync(async (req, res) => {
  await Playlist.deleteMany({ owner: req.user._id });
  await User.findByIdAndDelete(req.user._id);
  res.status(204).send();
});

// --- Gestión de usuarios (solo admin) ---

export const getAllUsers = catchAsync(async (req, res) => {
  const features = new APIFeatures(User.find(), req.query)
    .search(['username', 'email'])
    .sort()
    .paginate();
  const [users, total] = await Promise.all([features.query, User.countDocuments()]);

  res.status(200).json({
    status: 'success',
    results: users.length,
    pagination: { ...features.pagination, total },
    data: { users: users.map(sanitizeUser) },
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(constructorError('Usuario no encontrado.', 404));
  res.status(200).json({ status: 'success', data: { user: sanitizeUser(user) } });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(constructorError('Usuario no encontrado.', 404));
  await Playlist.deleteMany({ owner: user._id });
  await user.deleteOne();
  res.status(204).send();
});
