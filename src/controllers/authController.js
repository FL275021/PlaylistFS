const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  plan: user.plan,
  createdAt: user.createdAt,
});

exports.register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    const field = existing.username === username ? 'username' : 'email';
    return next(new AppError(`Ese ${field} ya  ha sido registrado.`, 409));
  }

  // el rol o plan nunca son tomados del client - si se autoregistra siempre es "user/plus" 
  const user = await User.create({ username, email, password, role: 'user', plan: 'plus' });
  const token = generateToken(user);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: sanitizeUser(user) },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Password/Email invalidos.', 401));
  }

  const token = generateToken(user);

  res.status(200).json({
    status: 'success',
    token,
    data: { user: sanitizeUser(user) },
  });
});

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({ status: 'success', data: { user: sanitizeUser(req.user) } });
});
