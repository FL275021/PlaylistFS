import 'dotenv/config';
import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('Falta la variable de entorno MONGO_URI');
  }

  await mongoose.connect(uri);
  isConnected = true;
  console.log(`MongoDB conectado: ${mongoose.connection.host}`);
  return mongoose.connection;
};
