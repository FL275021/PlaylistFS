import jwt from 'jsonwebtoken';

const baseOptions = {
  algorithm: 'HS256',
  issuer: 'music-playlist-api',
  audience: 'music-playlist-client',
};

export const generarAccessTokenByUser = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    plan: user.plan,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    ...baseOptions,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET, baseOptions);
