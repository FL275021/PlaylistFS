import catchAsync from '../utils/catchAsync.js';
import { constructorError } from '../utils/constructor.error.js';
import Playlist from '../models/Playlist.js';
import { Plan, PLUS_PLAYLIST_LIMIT } from '../constants/plan.constants.js';

// Los usuarios plus pueden crear hasta PLUS_PLAYLIST_LIMIT playlists; los premium, ilimitadas.
export const enforcePlaylistLimit = catchAsync(async (req, res, next) => {
  if (req.user.plan === Plan.premium) return next();

  const count = await Playlist.countDocuments({ owner: req.user._id });
  if (count >= PLUS_PLAYLIST_LIMIT) {
    return next(
      constructorError(
        `El plan plus está limited to ${PLUS_PLAYLIST_LIMIT} playlists. Actualiza a premium para playlists ilimitadas.`,
        403
      )
    );
  }
  next();
});
