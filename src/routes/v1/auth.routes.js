const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../../controllers/authController');
const validate = require('../../middlewares/validate');
const { registerSchema, loginSchema } = require('../../validations/authValidation');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

// Tighter limiter on auth endpoints specifically, to slow down brute force / credential stuffing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Too many attempts, please try again later.' },
});

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
