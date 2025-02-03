const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, "file_" + Date.now() + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);

  if (ext !== ".jpg" && ext !== ".png") {
    return cb(new Error("Invalid image extension."));
  }

  cb(null, true);
};

const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter,
});

module.exports = upload;
