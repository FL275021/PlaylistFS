import catchAsync from '../utils/catchAsync.js';
import { constructorError } from '../utils/constructor.error.js';
import Playlist from '../models/Playlist.js';
import Genre from '../models/Genre.js';
import APIFeatures from '../utils/apiFeatures.js';
import * as cloudinaryService from '../services/cloudinary.service.js';
import * as aiService from '../services/ai.service.js';

const obtenerPlaylistPropia = async (id, user) => {
  const playlist = await Playlist.findById(id);
  if (!playlist) return { error: constructorError('Playlist no encontrada.', 404) };
  if (String(playlist.owner) !== String(user._id) && user.role !== 'admin') {
    return { error: constructorError('No tienes acceso a esta playlist.', 403) };
  }
  return { playlist };
};

export const createPlaylist = catchAsync(async (req, res, next) => {
  const genre = await Genre.findById(req.body.genre);
  if (!genre) return next(constructorError('Género no encontrado.', 404));

  const playlist = await Playlist.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ status: 'success', data: { playlist } });
});

export const getPlaylists = catchAsync(async (req, res) => {
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

export const getPlaylist = catchAsync(async (req, res, next) => {
  const { playlist, error } = await obtenerPlaylistPropia(req.params.id, req.user);
  if (error) return next(error);
  await playlist.populate('genre', 'name');
  res.status(200).json({ status: 'success', data: { playlist } });
});

export const updatePlaylist = catchAsync(async (req, res, next) => {
  const { playlist, error } = await obtenerPlaylistPropia(req.params.id, req.user);
  if (error) return next(error);

  if (req.body.genre) {
    const genre = await Genre.findById(req.body.genre);
    if (!genre) return next(constructorError('Género no encontrado.', 404));
  }

  Object.assign(playlist, req.body);
  await playlist.save();
  res.status(200).json({ status: 'success', data: { playlist } });
});

export const deletePlaylist = catchAsync(async (req, res, next) => {
  const { playlist, error } = await obtenerPlaylistPropia(req.params.id, req.user);
  if (error) return next(error);
  await playlist.deleteOne();
  res.status(204).send();
});

export const uploadCoverImage = catchAsync(async (req, res, next) => {
  const { playlist, error } = await obtenerPlaylistPropia(req.params.id, req.user);
  if (error) return next(error);

  if (!req.file) return next(constructorError('No se proporcionó ninguna imagen.', 400));

  let result;
  try {
    result = await cloudinaryService.uploadImageBuffer(req.file.buffer);
  } catch {
    return next(constructorError('Error al subir la imagen. Intente nuevamente.', 502));
  }

  playlist.coverImageUrl = result.secure_url;
  await playlist.save();
  res.status(200).json({ status: 'success', data: { playlist } });
});

export const addTrack = catchAsync(async (req, res, next) => {
  const { playlist, error } = await obtenerPlaylistPropia(req.params.id, req.user);
  if (error) return next(error);
  playlist.tracks.push(req.body);
  await playlist.save();
  res.status(201).json({ status: 'success', data: { playlist } });
});

export const removeTrack = catchAsync(async (req, res, next) => {
  const { playlist, error } = await obtenerPlaylistPropia(req.params.id, req.user);
  if (error) return next(error);
  playlist.tracks = playlist.tracks.filter((t) => String(t._id) !== req.params.trackId);
  await playlist.save();
  res.status(200).json({ status: 'success', data: { playlist } });
});

// Punto de integración con IA generativa.
// Si Gemini falla, el servicio devuelve una descripción por defecto — nunca un error 500.
export const generateVibe = catchAsync(async (req, res, next) => {
  const { playlist, error } = await obtenerPlaylistPropia(req.params.id, req.user);
  if (error) return next(error);

  await playlist.populate('genre', 'name');
  const genreName = playlist.genre?.name || 'variado';
  const trackTitles = playlist.tracks.map((t) => t.title);

  const { vibe, generadoPorIA } = await aiService
    .generarVibePlaylist({ genreName, trackTitles })
    .then((vibe) => ({ vibe, generadoPorIA: true }))
    .catch(() => ({ vibe: aiService.vibeDefault(genreName), generadoPorIA: false }));

  playlist.aiVibeSummary = vibe;
  await playlist.save();

  res.status(200).json({ status: 'success', data: { aiVibeSummary: vibe, generadoPorIA } });
});
