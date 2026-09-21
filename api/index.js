import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

let connectionPromise = null;

export default async (req, res) => {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }
  await connectionPromise;
  return app(req, res);
};
