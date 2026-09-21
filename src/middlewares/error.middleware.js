// Manejador central de errores — debe registrarse con app.use() como último middleware.
export const errorMiddleware = (err, req, res, next) => {
  // Error de cast de Mongoose (ID con formato inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Valor inválido para ${err.path}: ${err.value}` });
  }

  // Error de clave duplicada de MongoDB (unique constraint)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `El ${campo} "${err.keyValue[campo]}" ya está en uso.` });
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message).join('; ');
    return res.status(400).json({ message: mensajes });
  }

  // Token JWT inválido
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token inválido. Por favor inicia sesión de nuevo.' });
  }

  // Token JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Tu sesión expiró. Por favor inicia sesión de nuevo.' });
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
