require("dotenv").config();
const express = require("express");
const app = express();
const todoRoutes = require("./routes/tododb.js");
const { todos } = require("./routes/todo.js"); // Data dummy
const db = require("./database/db");
const port = process.env.PORT;
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");

// ===== Tambahkan ini: Import Route & Middleware Otentikasi =====
const authRoutes = require("./routes/auth.js"); // Impor rute otentikasi
const authMiddleware = require("./middleware/auth"); // Impor middleware otentikasi
// ===============================================================

app.use(cors());
app.use(expressLayouts);
app.set("layout", "layouts/main-layouts");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ===== Gunakan Rute Otentikasi =====
app.use("/api/auth", authRoutes);

// ===== Lindungi Rute TODO dengan Middleware =====
app.use("/api/todos", authMiddleware, todoRoutes);

// Atur EJS sebagai view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// Endpoint untuk mendapatkan data todos dummy
app.get("/todos-data", (req, res) => {
  res.json(todos);
});

// Render todo dari database
app.get("/todo-view", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo", { todos: todos });
  });
});

app.get("/todos-list", (req, res) => {
  res.render("todos-page", { todos: todos });
});

// API CRUD TODOS
app.get("/api/todos", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    res.json({ todos: todos });
  });
});

app.post("/api/todos", (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: "Task is required" });

  const query = "INSERT INTO todos (task, completed) VALUES (?, ?)";
  db.query(query, [task, false], (err, result) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });

    res.status(201).json({
      message: "Todo added successfully",
      id: result.insertId,
      task,
      completed: false,
    });
  });
});

app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ error: "Invalid 'completed' value. Must be a boolean." });
  }

  const query = "UPDATE todos SET completed = ? WHERE id = ?";
  db.query(query, [completed, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo updated successfully" });
  });
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM todos WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  });
});

// Middleware untuk 404
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
