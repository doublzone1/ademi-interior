import multer from 'multer';
import { HttpError } from './errorHandler';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(
        new HttpError(
          400,
          `Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP`
        )
      );
      return;
    }
    cb(null, true);
  },
});
