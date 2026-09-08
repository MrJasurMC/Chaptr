const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `book-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
const textFileFilter = (req, file, cb) => {
  const name = file.originalname.toLowerCase();
  const isTextMime = file.mimetype === "text/plain" || file.mimetype === "application/rtf";
  if (isTextMime || name.endsWith(".txt") || name.endsWith(".rtf")) {
    cb(null, true);
  } else {
    cb(new Error("Only .txt or .rtf files are allowed"));
  }
};
const uploadBookText = multer({
  storage: multer.memoryStorage(),
  fileFilter: textFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});
module.exports = upload;
module.exports.uploadBookText = uploadBookText;
