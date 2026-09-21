import { Router } from 'express';
import { register, login, getMe } from '../../controllers/authController.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../../schemas/auth.schema.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authRateLimit } from '../../middlewares/rateLimit.middleware.js';

const authRoutes = Router();

authRoutes.post('/register', authRateLimit, validate(registerSchema), register);
authRoutes.post('/login', authRateLimit, validate(loginSchema), login);
authRoutes.get('/me', protect, getMe);

export default authRoutes;
