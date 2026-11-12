import mongoose from 'mongoose';
import { Role, Roles } from '../constants/role.constants.js';
import { Plan, Plans } from '../constants/plan.constants.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no tiene un formato válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: 8,
      select: false,
    },
    // Solo 'user' se asigna en el registro público.
    // Las cuentas 'admin' se pre-cargan con npm run seed.
    role: {
      type: String,
      enum: Roles,
      default: Role.user,
    },
    plan: {
      type: String,
      enum: Plans,
      default: Plan.plus,
    },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);
export default User;
