const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Genre = require('../models/Genre');
const Playlist = require('../models/Playlist');
const APIFeatures = require('../utils/apiFeatures');

exports.createGenre = catchAsync(async (req, res, next) => {
  const existing = await Genre.findOne({ name: req.body.name });
  if (existing) return next(new AppError('Un genero con ese nombre ya existe', 409));

  const genre = await Genre.create(req.body);
  res.status(201).json({ status: 'success', data: { genre } });
});

exports.getGenres = catchAsync(async (req, res) => {
  const features = new APIFeatures(Genre.find(), req.query).search(['name']).sort().paginate();
  const genres = await features.query;

  res.status(200).json({
    status: 'success',
    results: genres.length,
    data: { genres },
  });
});

exports.getGenre = catchAsync(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return next(new AppError('Genero no existe.', 404));
  res.status(200).json({ status: 'success', data: { genre } });
});

exports.updateGenre = catchAsync(async (req, res, next) => {
  const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!genre) return next(new AppError('Genero no existe.', 404));
  res.status(200).json({ status: 'success', data: { genre } });
});

exports.deleteGenre = catchAsync(async (req, res, next) => {
  const inUseCount = await Playlist.countDocuments({ genre: req.params.id });
  if (inUseCount > 0) {
    return next(
      new AppError(
        `No se pudo borrar este genero: esta siendo usado por la playlist: ${inUseCount} . Reasignar o borrar plalist antes.`,
        409
      )
    );
  }

  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return next(new AppError('Genero no existe.', 404));

  res.status(204).json({ status: 'success', data: null });
});
