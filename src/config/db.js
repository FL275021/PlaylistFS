const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI no fue definido en las variables de ambiente');
  }

  await mongoose.connect(uri);
  isConnected = true;
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  return mongoose.connection;
};

module.exports = connectDB;
