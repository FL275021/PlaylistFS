import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import genreRoutes from './genre.routes.js';
import playlistRoutes from './playlist.routes.js';
import trackRoutes from './track.routes.js';

const v1Routes = Router();

v1Routes.use('/auth', authRoutes);
v1Routes.use('/users', userRoutes);
v1Routes.use('/genres', genreRoutes);
v1Routes.use('/playlists', playlistRoutes);
v1Routes.use('/tracks', trackRoutes);

export default v1Routes;
