import mongoose from 'mongoose';

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

trackSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la playlist es obligatorio'],
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
      required: [true, 'El género de la playlist es obligatorio'],
    },
    coverImageUrl: { type: String, default: '' },
    tracks: [trackSchema],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Descripción de ambiente generada por IA - ver services/ai.service.js
    aiVibeSummary: { type: String, default: '' },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

playlistSchema.index({ owner: 1, genre: 1 });
playlistSchema.index({ name: 'text' });

playlistSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Playlist = mongoose.model('Playlist', playlistSchema);
export default Playlist;
