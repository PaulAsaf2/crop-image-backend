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
app.use((req, res, next) => {
  const { code } = req.query;

  if (code) {
    fs.writeFile('file.txt', code, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).send('Error writing to file');
      }
      console.log('Value saved to file', code);
    });
  }

  next();
})
app.use('/api', express.static(path.join(__dirname, '../../var/www/crop-image-frontend')));
// -------------------------------------
app.get('/api/get-code', (req, res) => {
  fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) res.status(404).send({message: 'File not found.'});

    res.send({message: data});
  });
});
// -------------------------------------
app.post('/api/submit', upload.single('image'), (req, res) => {
  try {
    const { filename } = req.file;
    const filepath = path.join(__dirname, `uploads/${filename}`);
    const file = fs.readFile(filepath, (err, data) => {
      if (err) throw err;
      res.status(200).send({ message: req.file.filename })
    });
  } catch (err) {
    res.status(500).send({ message: 'Oops! Something went wrong!' })
  }
})
// -------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
})