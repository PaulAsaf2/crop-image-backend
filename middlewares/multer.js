const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = 'C:\\Users\\pavel\\repositories\\magnetto\\telegram-mini-app\\wallstring\\crop-image-divided\\backend\\uploads';
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const [, ext] = file.mimetype.split('/')
    cb(null, `${Date.now()}-${file.originalname}.${ext}`);
  }
})
const upload = multer({ storage: storage });
module.exports.uploadSingle = upload.single('image');