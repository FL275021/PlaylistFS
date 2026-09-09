const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const APIFeatures = require('../utils/apiFeatures');
const sanitizeUser = require('../utils/sanitizeUser');
const { PLUS_PLAYLIST_LIMIT } = require('../middlewares/planCheck');

exports.upgradePlan = catchAsync(async (req, res, next) => {
  if (req.user.plan === 'premium') {
    return next(new AppError('Ya tienes el plan premium', 400));
  }

  req.user.plan = 'premium';
  await req.user.save();

  res.status(200).json({
    status: 'success',
    data: { plan: req.user.plan },
  });
});

// Endpoint dedicado para que el widget de "Reporte de Uso" no neceiste contar toda la lista de playlists.
exports.getUsage = catchAsync(async (req, res) => {
  const used = await Playlist.countDocuments({ owner: req.user._id });

  if (req.user.plan === 'plus') {
    return res.status(200).json({
      status: 'success',
      data: {
        plan: 'plus',
        used,
        limit: PLUS_PLAYLIST_LIMIT,
        percentageUsed: Math.round((used / PLUS_PLAYLIST_LIMIT) * 100),
      },
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      plan: 'premium',
      used,
      limit: null,
      percentageUsed: null,
    },
  });
});


// (GET /auth/me devuelve el usuario actual - ver authController.getMe)
exports.updateMe = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;

  if (username || email) {
    const existing = await User.findOne({
      _id: { $ne: req.user._id },
      $or: [...(username ? [{ username }] : []), ...(email ? [{ email }] : [])],
    });
    if (existing) {
      const field = existing.username === username ? 'username' : 'email';
      return next(new AppError(`That ${field} is already in use.`, 409));
    }
  }

  if (username) req.user.username = username;
  if (email) req.user.email = email;
  await req.user.save();

  res.status(200).json({ status: 'success', data: { user: sanitizeUser(req.user) } });
});

//borra las playlist del usuario en CASCADA asi no quedan documentos apuntando a nada 
exports.deleteMe = catchAsync(async (req, res) => {
  await Playlist.deleteMany({ owner: req.user._id });
  await User.findByIdAndDelete(req.user._id);
  res.status(204).json({ status: 'success', data: null });
});


// Administracion de usuarios para los ADMINS
exports.getAllUsers = catchAsync(async (req, res) => {
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

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));
  res.status(200).json({ status: 'success', data: { user: sanitizeUser(user) } });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));

  await Playlist.deleteMany({ owner: user._id });
  await user.deleteOne();

  res.status(204).json({ status: 'success', data: null });
});