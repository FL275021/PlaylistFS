import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

let connectionPromise = null;

export default async (req, res) => {
  const requestPath = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  if (requestPath === '/health' || !requestPath.startsWith('/api/')) {
    return app(req, res);
  }

  if (!connectionPromise) {
    connectionPromise = connectDB();
  }
  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    console.error('MongoDB connection failed:', error.name);
    res.writeHead(503, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'error',
      message: 'Database unavailable. Check the deployment database configuration.',
    }));
  }

  return app(req, res);
};
