const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API đang chạy!' });
});

module.exports = app;