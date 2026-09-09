const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const itunesService = require('../services/itunes.service');

exports.searchTracks = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return next(new AppError('Parametro "q" requerido.', 400));
  }

  const results = await itunesService.searchTracks(q.trim());
  res.status(200).json({ status: 'success', results: results.length, data: { tracks: results } });
});
