import { rateLimit } from 'express-rate-limit';

// Límite general: 300 peticiones cada 15 minutos por IP.
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({ message: 'Demasiadas peticiones. Intente nuevamente más tarde.' }),
});

// Límite estricto para autenticación: 20 intentos cada 15 minutos por IP.
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({ message: 'Demasiados intentos. Intente nuevamente en 15 minutos.' }),
});
