require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const v1Routes = require('./routes/v1');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

// --- OWASP API Top 10 hardening ---
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(mongoSanitize()); // strips $/. operators from user input to prevent NoSQL injection

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is up' });
});

app.use('/api/v1', v1Routes);

app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server.`, 404));
});

app.use(errorHandler);

module.exports = app;
