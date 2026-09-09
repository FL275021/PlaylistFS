const express = require('express');
const genreController = require('../../controllers/genreController');
const validate = require('../../middlewares/validate');
const { createGenreSchema, updateGenreSchema } = require('../../validations/genreValidation');
const { protect, restrictTo } = require('../../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/', genreController.getGenres);
router.get('/:id', genreController.getGenre);
router.post('/', restrictTo('admin'), validate(createGenreSchema), genreController.createGenre);
router.patch('/:id', restrictTo('admin'), validate(updateGenreSchema), genreController.updateGenre);
router.delete('/:id', restrictTo('admin'), genreController.deleteGenre);

module.exports = router;
