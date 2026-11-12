const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  plan: user.plan,
  createdAt: user.createdAt,
});

export default sanitizeUser;
