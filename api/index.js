const app = require('../src/app');
const connectDB = require('../src/config/db');

let connectionPromise = null;

module.exports = async (req, res) => {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }
  await connectionPromise;
  return app(req, res);
};
