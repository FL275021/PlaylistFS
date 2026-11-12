import { Router } from 'express';
import {
  upgradePlan, getUsage, updateMe, deleteMe,
  getAllUsers, getUserById, deleteUser,
} from '../../controllers/userController.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateMeSchema } from '../../schemas/user.schema.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { soloAdmin } from '../../middlewares/rol.middleware.js';

const userRoutes = Router();

userRoutes.use(protect);

// Auto-gestión del usuario autenticado
userRoutes.patch('/me/upgrade-plan', upgradePlan);
userRoutes.get('/me/usage', getUsage);
userRoutes.patch('/me', validate(updateMeSchema), updateMe);
userRoutes.delete('/me', deleteMe);

// Solo admin
userRoutes.get('/', soloAdmin, getAllUsers);
userRoutes.get('/:id', soloAdmin, getUserById);
userRoutes.delete('/:id', soloAdmin, deleteUser);

export default userRoutes;
