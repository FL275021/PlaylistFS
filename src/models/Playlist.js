const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, default: '' },
    durationMs: { type: Number, default: 0 },
    previewUrl: { type: String, default: '' },
    artworkUrl: { type: String, default: '' },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Playlist name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
      required: [true, 'Playlist genre is required'],
    },
    coverImageUrl: {
      type: String,
      default: '',
    },
    tracks: [trackSchema],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Short AI-generated mood/vibe description - see services/ai.service.js
    aiVibeSummary: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

playlistSchema.index({ owner: 1, genre: 1 });
playlistSchema.index({ name: 'text' });

module.exports = mongoose.model('Playlist', playlistSchema);
