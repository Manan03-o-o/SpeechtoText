import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = './uploads';

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/m4a',
    'audio/x-m4a',
    'audio/mp4',
    'video/mp4',
    'audio/webm',
    'video/webm',
    'audio/ogg',
    'application/octet-stream' // Recorded blobs are sometimes sent as application/octet-stream
  ];

  const allowedExtensions = ['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm', '.ogg'];
  const ext = path.extname(file.originalname).toLowerCase();

  // If mime type matches or extension matches
  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext) || !ext) {
    // Note: recorded files via MediaRecorder may not have an extension or have a generic mime type, we let them pass if they are sent from the recorder
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only MP3, WAV, M4A, MP4, and WEBM files are allowed.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit (OpenAI API limit)
  },
});

export default upload;
