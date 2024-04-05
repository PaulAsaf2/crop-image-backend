const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
// -------------------------------------
const app = express();
const PORT = 3000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = '/root/crop-image-backend/uploads';
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const [, ext] = file.mimetype.split('/')
    cb(null, `${Date.now()}-${file.originalname}.${ext}`);
  }
})
const upload = multer({ storage: storage });
// -------------------------------------
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// -------------------------------------
let codeID

app.get('/api', (req, res) => {
  const { code } = req.query;
  codeID = code;

  res.send(req.query);
})
// -------------------------------------
app.get('/api/get-code', (req, res) => {
  res.send({code: codeID});
})
// -------------------------------------
app.post('/api/submit', upload.single('image'), (req, res) => {
  try {
    const { filename } = req.file;
    const filepath = path.join(__dirname, `uploads/${filename}`);
    const file = fs.readFile(filepath, (err, data) => {
      if (err) throw err;
      res.status(200).send({ message: 'Upload succeed!' })
    });
  } catch (err) {
    res.status(500).send({ message: 'Oops! Something went wrong!' })
  }
})
// -------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
})