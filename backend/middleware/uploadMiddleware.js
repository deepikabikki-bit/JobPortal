import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads folder exists
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(sanitizedOriginal)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedDocTypes = ['.pdf', '.doc', '.docx'];
  const allowedImgTypes = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'resume') {
    if (allowedDocTypes.includes(ext) || file.mimetype === 'application/pdf' || file.mimetype.includes('word')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed for resumes!'), false);
    }
  } else if (file.fieldname === 'logo' || file.fieldname === 'avatar') {
    if (allowedImgTypes.includes(ext) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP, SVG) are allowed!'), false);
    }
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});
