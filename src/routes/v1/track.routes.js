const express = require('express');
const trackController = require('../../controllers/trackController');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

router.use(protect);
router.get('/search', trackController.searchTracks);

module.exports = router;
