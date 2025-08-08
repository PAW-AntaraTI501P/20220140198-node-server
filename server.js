const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware untuk logging setiap request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // lanjut ke handler berikutnya
});

// Set view engine ke EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routing ke halaman index
app.get('/', (req, res) => {
  res.render('index'); // memanggil views/index.ejs
});

// Routing ke halaman contact
app.get('/contact', (req, res) => {
  res.render('contact'); // memanggil views/contact.ejs
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
