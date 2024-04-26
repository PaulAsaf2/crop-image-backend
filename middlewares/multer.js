const { localDestinationPath, prodDestinationPath } = require('../constants');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = prodDestinationPath;
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const [, ext] = file.mimetype.split('/')
    cb(null, `${Date.now()}-${file.originalname}.${ext}`);
  }
})
const upload = multer({ storage: storage });
module.exports.uploadSingle = upload.single('image');