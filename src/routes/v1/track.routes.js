import { Router } from 'express';
import { searchTracks } from '../../controllers/trackController.js';
import { protect } from '../../middlewares/auth.middleware.js';

const trackRoutes = Router();

trackRoutes.use(protect);
trackRoutes.get('/search', searchTracks);

export default trackRoutes;
