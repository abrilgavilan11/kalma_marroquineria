const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

// Asegurar que el directorio de subidas exista
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Solo se permiten archivos de imagen (JPG, JPEG, PNG, WEBP, GIF)');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 5000000 } // 5MB max
});

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No se recibió ninguna imagen' });
  }
  // Devolver URL accesible desde el frontend
  // El frontend asumirá la URL base del backend + /uploads/...
  const fullUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, url: fullUrl });
});

module.exports = router;
