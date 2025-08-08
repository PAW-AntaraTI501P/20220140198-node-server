const express = require("express");
const app = express();
const todoRoutes = require("./todo");

// Middleware ini penting untuk membaca body JSON
app.use(express.json());

app.use("/api/todos", todoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
