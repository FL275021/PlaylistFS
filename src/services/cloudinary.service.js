import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

export const uploadImageBuffer = (buffer, folder = 'music-playlist-api/covers') =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
