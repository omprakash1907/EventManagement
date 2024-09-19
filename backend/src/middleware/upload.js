const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Save images in 'src/uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique filenames
  }
});

// Filter for image types (JPEG, PNG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (JPEG, PNG, GIF)!'));
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit image size to 1MB
  fileFilter: fileFilter
});

module.exports = upload;
