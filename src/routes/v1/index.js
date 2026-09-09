const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const genreRoutes = require('./genre.routes');
const playlistRoutes = require('./playlist.routes');
const trackRoutes = require('./track.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/genres', genreRoutes);
router.use('/playlists', playlistRoutes);
router.use('/tracks', trackRoutes);

module.exports = router;
