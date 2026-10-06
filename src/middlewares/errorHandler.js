const AppError = require('../utils/AppError');

const handleCastError = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`${field} "${value}" is already in use.`, 409);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  return new AppError(messages.join('; '), 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);

module.exports = (err, req, res, next) => {
  let error = err;

  if (error.name === 'CastError') error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateFieldsError(error);
  if (error.name === 'ValidationError') error = handleValidationError(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(statusCode).json({
    status,
    message: error.isOperational ? error.message : 'Something went wrong on the server.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};