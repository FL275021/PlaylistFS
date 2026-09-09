const express = require('express');
const multer = require('multer');
const playlistController = require('../../controllers/playlistController');
const validate = require('../../middlewares/validate');
const {
  createPlaylistSchema,
  updatePlaylistSchema,
  addTrackSchema,
} = require('../../validations/playlistValidation');
const { protect } = require('../../middlewares/auth');
const { enforcePlaylistLimit } = require('../../middlewares/planCheck');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(protect);

router.get('/', playlistController.getPlaylists);
router.post('/', enforcePlaylistLimit, validate(createPlaylistSchema), playlistController.createPlaylist);
router.get('/:id', playlistController.getPlaylist);
router.patch('/:id', validate(updatePlaylistSchema), playlistController.updatePlaylist);
router.delete('/:id', playlistController.deletePlaylist);

router.post('/:id/cover-image', upload.single('image'), playlistController.uploadCoverImage);
router.post('/:id/tracks', validate(addTrackSchema), playlistController.addTrack);
router.delete('/:id/tracks/:trackId', playlistController.removeTrack);
router.post('/:id/generate-vibe', playlistController.generateVibe);

module.exports = router;
