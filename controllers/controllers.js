const fs = require('fs');
const path = require('path');

module.exports.writeFile = (req, res) => {
  const { filename } = req.file;
  const filepath = path.join(__dirname, `../uploads/${filename}`);
  fs.readFile(filepath, (err, data) => {
    if (err) return res.status(400).send({ error: 'Ошибка при чтении файла' });
    res.status(200).send({ message: req.file.filename })
  });
};

module.exports.getCode = (req, res) => {
  fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) res.status(404).send({ message: 'File not found.' });

    res.send({ message: data });
  });
}