import catchAsync from '../utils/catchAsync.js';
import { constructorError } from '../utils/constructor.error.js';
import Genre from '../models/Genre.js';
import Playlist from '../models/Playlist.js';
import APIFeatures from '../utils/apiFeatures.js';

export const createGenre = catchAsync(async (req, res, next) => {
  const existente = await Genre.findOne({ name: req.body.name });
  if (existente) return next(constructorError('Ya existe un género con ese nombre.', 409));

  const genre = await Genre.create(req.body);
  res.status(201).json({ status: 'success', data: { genre } });
});

export const getGenres = catchAsync(async (req, res) => {
  const features = new APIFeatures(Genre.find(), req.query).search(['name']).sort().paginate();
  const [genres, total] = await Promise.all([features.query, Genre.countDocuments()]);

  res.status(200).json({
    status: 'success',
    results: genres.length,
    pagination: { ...features.pagination, total },
    data: { genres },
  });
});

export const getGenre = catchAsync(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return next(constructorError('Género no encontrado.', 404));
  res.status(200).json({ status: 'success', data: { genre } });
});

export const updateGenre = catchAsync(async (req, res, next) => {
  const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!genre) return next(constructorError('Género no encontrado.', 404));
  res.status(200).json({ status: 'success', data: { genre } });
});

export const deleteGenre = catchAsync(async (req, res, next) => {
  const enUso = await Playlist.countDocuments({ genre: req.params.id });
  if (enUso > 0) {
    return next(
      constructorError(
        `No se puede eliminar este género: está usado por ${enUso} playlist(s). Reasigna o elimínalas primero.`,
        409
      )
    );
  }

  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return next(constructorError('Género no encontrado.', 404));

  res.status(204).send();
});
