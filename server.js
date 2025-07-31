const express = require('express');
const app = express();
const port = 3000;

// Middleware logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routing halaman index
app.get('/', (req, res) => {
  res.send('<h1>Halaman Index</h1>');
});

app.get('/contact', (req, res) => {
  res.send('<h1>Halaman Contact</h1>');
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
