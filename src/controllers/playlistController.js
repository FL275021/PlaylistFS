const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Playlist = require('../models/Playlist');
const Genre = require('../models/Genre');
const APIFeatures = require('../utils/apiFeatures');
const cloudinaryService = require('../services/cloudinary.service');
const aiService = require('../services/ai.service');

const findOwnedPlaylist = async (id, user) => {
  const playlist = await Playlist.findById(id);
  if (!playlist) return { error: new AppError('Playlist no encontrada.', 404) };
  if (String(playlist.owner) !== String(user._id) && user.role !== 'admin') {
    return { error: new AppError('No tienes acceso a esta playlist.', 403) };
  }
  return { playlist };
};

exports.createPlaylist = catchAsync(async (req, res, next) => {
  const genre = await Genre.findById(req.body.genre);
  if (!genre) return next(new AppError('Genero no existe.', 404));

  const playlist = await Playlist.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ status: 'success', data: { playlist } });
});

//Playlists accesibles para el usuario logueado, paginadas y filtrables
// e.g. -> ?genre=<id>&search=road+trip&page=2&limit=10
exports.getPlaylists = catchAsync(async (req, res) => {
  const baseQuery = Playlist.find({ owner: req.user._id }).populate('genre', 'name');

  const features = new APIFeatures(baseQuery, req.query).filter().search(['name']).sort().paginate();

  const [playlists, total] = await Promise.all([
    features.query,
    Playlist.countDocuments({ owner: req.user._id }),
  ]);

  res.status(200).json({
    status: 'success',
    results: playlists.length,
    pagination: { ...features.pagination, total },
    data: { playlists },
  });
});

exports.getPlaylist = catchAsync(async (req, res, next) => {
  const { playlist, error } = await findOwnedPlaylist(req.params.id, req.user);
  if (error) return next(error);

  await playlist.populate('genre', 'name');
  res.status(200).json({ status: 'success', data: { playlist } });
});

exports.updatePlaylist = catchAsync(async (req, res, next) => {
  const { playlist, error } = await findOwnedPlaylist(req.params.id, req.user);
  if (error) return next(error);

  if (req.body.genre) {
    const genre = await Genre.findById(req.body.genre);
    if (!genre) return next(new AppError('Genero no existe.', 404));
  }

  Object.assign(playlist, req.body);
  await playlist.save();

  res.status(200).json({ status: 'success', data: { playlist } });
});

exports.deletePlaylist = catchAsync(async (req, res, next) => {
  const { playlist, error } = await findOwnedPlaylist(req.params.id, req.user);
  if (error) return next(error);

  await playlist.deleteOne();
  res.status(204).json({ status: 'success', data: null });
});

exports.uploadCoverImage = catchAsync(async (req, res, next) => {
  const { playlist, error } = await findOwnedPlaylist(req.params.id, req.user);
  if (error) return next(error);

  if (!req.file) return next(new AppError('No hay archivo de imagen.', 400));

  let result;
  try {
    result = await cloudinaryService.uploadImageBuffer(req.file.buffer);
  } catch (err) {
    return next(new AppError('Error al subir imagen', 502));
  }

  playlist.coverImageUrl = result.secure_url;
  await playlist.save();

  res.status(200).json({ status: 'success', data: { playlist } });
});

exports.addTrack = catchAsync(async (req, res, next) => {
  const { playlist, error } = await findOwnedPlaylist(req.params.id, req.user);
  if (error) return next(error);

  playlist.tracks.push(req.body);
  await playlist.save();

  res.status(201).json({ status: 'success', data: { playlist } });
});

exports.removeTrack = catchAsync(async (req, res, next) => {
  const { playlist, error } = await findOwnedPlaylist(req.params.id, req.user);
  if (error) return next(error);

  playlist.tracks = playlist.tracks.filter((track) => String(track._id) !== req.params.trackId);
  await playlist.save();

  res.status(200).json({ status: 'success', data: { playlist } });
});

//Region IA - no muestra request rotas, en vez muestra una descripcion ppor defecto
exports.generateDesc = catchAsync(async (req, res, next) => {
  const { playlist, error } = await findOwnedPlaylist(req.params.id, req.user);
  if (error) return next(error);

  await playlist.populate('genre', 'name');
  const genreName = playlist.genre?.name || 'eclectic';
  const trackTitles = playlist.tracks.map((track) => track.title);

  let summary;
  let generatedByAI = true;

  try {
    summary = await aiService.generateDescSummary({ genreName, trackTitles });
  } catch (err) {
    console.error('Error al generar descripcion AI, usar por defecto:', err.message);
    summary = aiService.fallbackDescSummary(genreName);
    generatedByAI = false;
  }

  playlist.aiDescSummary = summary;
  await playlist.save();

  res.status(200).json({
    status: 'success',
    data: { aiDescSummary: summary, generatedByAI },
  });
});
