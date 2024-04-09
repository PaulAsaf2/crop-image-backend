const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
// -------------------------------------
const app = express();
const PORT = 3000;
const options = {
  key: fs.readFileSync('./127.0.0.1-key.pem'),
  cert: fs.readFileSync('./127.0.0.1.pem'),
};
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
// -------------------------------------
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  // const { code } = req.query;
  const code = '11111111111';

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
app.use('/api', express.static(path.join(__dirname, '../frontend')));
// -------------------------------------
app.get('/api/get-code', (req, res) => {
  fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) res.status(404).send({message: 'File not found.'});

    res.send({message: data});
  });
});
// -------------------------------------
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    const { filename } = req.file;
    const filepath = path.join(__dirname, `uploads/${filename}`);
    fs.readFile(filepath, (err, data) => {
      if (err) throw err;
      res.status(200).send({ message: req.file.filename })
    });
  } catch (err) {
    res.status(500).send({ message: 'Oops! Something went wrong!' })
  }
})
// -------------------------------------
const server = https.createServer(options, app);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on port ${PORT}`);
})