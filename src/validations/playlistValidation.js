const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

exports.createPlaylistSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).allow('').optional(),
  genre: objectId.required(),
  isPublic: Joi.boolean().optional(),
});

exports.updatePlaylistSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  description: Joi.string().max(500).allow('').optional(),
  genre: objectId.optional(),
  isPublic: Joi.boolean().optional(),
}).min(1);

// Shape matches the fields returned by services/itunes.service.js so a search
// result can be posted here almost as-is.
exports.addTrackSchema = Joi.object({
  title: Joi.string().required(),
  artist: Joi.string().required(),
  album: Joi.string().allow('').optional(),
  durationMs: Joi.number().min(0).optional(),
  previewUrl: Joi.string().uri().allow('').optional(),
  artworkUrl: Joi.string().uri().allow('').optional(),
});
