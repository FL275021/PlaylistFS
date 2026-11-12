const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Playlist = require('../models/Playlist');

const PLUS_PLAYLIST_LIMIT = 4;

// Plus users can create at most PLUS_PLAYLIST_LIMIT playlists; premium is unlimited.
exports.enforcePlaylistLimit = catchAsync(async (req, res, next) => {
  if (req.user.plan === 'premium') return next();

  const count = await Playlist.countDocuments({ owner: req.user._id });
  if (count >= PLUS_PLAYLIST_LIMIT) {
    return next(
      new AppError(
        `Plus plan is limited to ${PLUS_PLAYLIST_LIMIT} playlists. Upgrade to premium for unlimited playlists.`,
        403
      )
    );
  }
  next();
});

exports.PLUS_PLAYLIST_LIMIT = PLUS_PLAYLIST_LIMIT;
