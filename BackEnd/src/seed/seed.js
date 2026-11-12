import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Genre from '../models/Genre.js';
import { hashear } from '../utils/hash.util.js';
import { Role } from '../constants/role.constants.js';
import { Plan } from '../constants/plan.constants.js';

const GENEROS_DEFAULT = [
  'Pop', 'Rock', 'Jazz', 'Hip-Hop', 'Electrónica', 'Clásica', 'Reggaetón', 'Cumbia',
];

const seed = async () => {  
  await connectDB();

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Jamaica,123';

  const existeAdmin = await User.findOne({ username: adminUsername });
  if (!existeAdmin) {
    const passwordHash = await hashear(adminPassword);
    await User.create({
      username: adminUsername,
      email: adminEmail,
      password: passwordHash,
      role: Role.admin,
      plan: Plan.premium,
    });
    console.log(`Usuario admin creado: ${adminUsername} / ${adminEmail}`);
  } else {
    console.log('El usuario admin ya existe, omitiendo.');
  }

  for (const name of GENEROS_DEFAULT) {
    const existe = await Genre.findOne({ name });
    if (!existe) {
      await Genre.create({ name });
      console.log(`Género creado: ${name}`);
    }
  }
  
  console.log('Seed completado.');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed falló:', err.message);
  process.exit(1);
});
