const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

exports.uploadImageBuffer = (buffer, folder = 'music-playlist-api/covers') =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
