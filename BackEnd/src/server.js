import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

start().catch((err) => {
  console.error('Error al iniciar el servidor:', err.message);
  process.exit(1);
});
