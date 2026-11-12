import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const createPlaylistSchema = Joi.object({
  name: Joi.string().min(1).max(100).label('nombre').required(),
  description: Joi.string().max(500).allow('').label('descripción').optional(),
  genre: objectId.label('género').required(),
  isPublic: Joi.boolean().label('pública').optional(),
});

export const updatePlaylistSchema = Joi.object({
  name: Joi.string().min(1).max(100).label('nombre').optional(),
  description: Joi.string().max(500).allow('').label('descripción').optional(),
  genre: objectId.label('género').optional(),
  isPublic: Joi.boolean().label('pública').optional(),
}).min(1);

// El shape coincide con lo que devuelve services/itunes.service.js
export const addTrackSchema = Joi.object({
  title: Joi.string().label('título').required(),
  artist: Joi.string().label('artista').required(),
  album: Joi.string().allow('').label('álbum').optional(),
  durationMs: Joi.number().min(0).label('duración').optional(),
  previewUrl: Joi.string().uri().allow('').label('URL de vista previa').optional(),
  artworkUrl: Joi.string().uri().allow('').label('URL de imagen').optional(),
});
