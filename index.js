const fs = require('fs');
// const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
// -------------------------------------
const { writeFile, getCode } = require('./controllers/controllers');
const { uploadSingle } = require('./middlewares/multer');
const { localFrontendPath, prodFrontendPath } = require('./constants');
// -------------------------------------
const app = express();
const PORT = 3000;
// const options = {
//   key: fs.readFileSync('./127.0.0.1-key.pem'),
//   cert: fs.readFileSync('./127.0.0.1.pem'),
// };
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
app.use('/api', express.static(path.join(__dirname, prodFrontendPath)));
// -------------------------------------
app.get('/api/get-code', getCode);
app.post('/api/upload', uploadSingle, writeFile);
// -------------------------------------
// const server = https.createServer(options, app);
// server.listen(PORT, '127.0.0.1', () => {
//   console.log(`Server is running on port ${PORT}`);
// })
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});