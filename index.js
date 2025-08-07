const express = require("express");
const app = express();
const todoRoutes = require("./todo");

app.use(express.json());

// Middleware untuk menangani error JSON yang tidak valid
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: "JSON tidak valid" });
  }
  next(err);
});

app.use("/api/todos", todoRoutes);

// Middleware penanganan error global (catch-all)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
