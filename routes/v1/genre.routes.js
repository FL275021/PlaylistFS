import { Router } from 'express';
import { createGenre, getGenres, getGenre, updateGenre, deleteGenre } from '../../controllers/genreController.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createGenreSchema, updateGenreSchema } from '../../schemas/genre.schema.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { soloAdmin } from '../../middlewares/rol.middleware.js';

const genreRoutes = Router();

genreRoutes.use(protect);

genreRoutes.get('/', getGenres);
genreRoutes.get('/:id', getGenre);
genreRoutes.post('/', soloAdmin, validate(createGenreSchema), createGenre);
genreRoutes.patch('/:id', soloAdmin, validate(updateGenreSchema), updateGenre);
genreRoutes.delete('/:id', soloAdmin, deleteGenre);

export default genreRoutes;
