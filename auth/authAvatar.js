const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  dest: path.join(__dirname, "tmp"),
  limits: {
    fieldSize: 10485786,
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
