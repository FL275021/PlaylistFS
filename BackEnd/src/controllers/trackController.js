import catchAsync from '../utils/catchAsync.js';
import { constructorError } from '../utils/constructor.error.js';
import * as itunesService from '../services/itunes.service.js';

export const searchTracks = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  if (!q?.trim()) {
    return next(constructorError('El parámetro de búsqueda "q" es obligatorio.', 400));
  }

  const tracks = await itunesService.searchTracks(q.trim());
  res.status(200).json({ status: 'success', results: tracks.length, data: { tracks } });
});
