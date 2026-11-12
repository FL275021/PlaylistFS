import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

import v1Routes from './routes/v1/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { apiRateLimit } from './middlewares/rateLimit.middleware.js';
import { constructorError } from './utils/constructor.error.js';

const app = express();

// --- Seguridad OWASP API Top 10 ---
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(mongoSanitize()); // Previene inyección NoSQL eliminando $ y . del input

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api', apiRateLimit);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API de playlists disponible',
    endpoints: { health: '/health', api: '/api/v1' },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API funcionando correctamente' });
});

app.use('/api/v1', v1Routes);

app.all('*', (req, res, next) => {
  next(constructorError(`La ruta ${req.originalUrl} no existe en este servidor.`, 404));
});

app.use(errorMiddleware);

export default app;
