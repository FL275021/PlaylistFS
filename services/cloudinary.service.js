import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

export const uploadImageBuffer = async (buffer, folder = 'music-playlist-api/covers') => {
  if (process.env.NODE_ENV === 'test' && process.env.CLOUDINARY_UPLOAD_PREFIX) {
    const response = await fetch(`${process.env.CLOUDINARY_UPLOAD_PREFIX}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: buffer,
    });
    if (!response.ok) {
      throw new Error(`Test image upload returned HTTP ${response.status}`);
    }
    return response.json();
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};
