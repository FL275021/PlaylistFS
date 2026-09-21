import { Router } from 'express';
import multer from 'multer';
import {
  createPlaylist, getPlaylists, getPlaylist,
  updatePlaylist, deletePlaylist,
  uploadCoverImage, addTrack, removeTrack, generateVibe,
} from '../../controllers/playlistController.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createPlaylistSchema, updatePlaylistSchema, addTrackSchema } from '../../schemas/playlist.schema.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { enforcePlaylistLimit } from '../../middlewares/planCheck.middleware.js';
import { sanitizeTextFields } from '../../middlewares/sanitize.middleware.js';

const playlistRoutes = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

playlistRoutes.use(protect);

playlistRoutes.get('/', getPlaylists);
playlistRoutes.post('/', enforcePlaylistLimit, sanitizeTextFields('name', 'description'), validate(createPlaylistSchema), createPlaylist);
playlistRoutes.get('/:id', getPlaylist);
playlistRoutes.patch('/:id', sanitizeTextFields('name', 'description'), validate(updatePlaylistSchema), updatePlaylist);
playlistRoutes.delete('/:id', deletePlaylist);

playlistRoutes.post('/:id/cover-image', upload.single('image'), uploadCoverImage);
playlistRoutes.post('/:id/tracks', sanitizeTextFields('title', 'artist', 'album'), validate(addTrackSchema), addTrack);
playlistRoutes.delete('/:id/tracks/:trackId', removeTrack);
playlistRoutes.post('/:id/generate-vibe', generateVibe);

export default playlistRoutes;
