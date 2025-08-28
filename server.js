require("dotenv").config();
const express = require("express");
const app = express();
const todoRoutes = require("./routes/tododb.js");
const { todos } = require("./routes/todo.js"); // Menambahkan ini untuk mengimpor data dummy
const db = require("./database/db");
const port = process.env.PORT;
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
app.use(cors());

app.use(expressLayouts);
app.set('layout', 'layouts/main-layouts');

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/todos", todoRoutes);


// Atur EJS sebagai view engine
app.set("view engine", "ejs");


app.get("/", (req, res) => {
  res.render("index"); // render file index.ejs
});

app.get("/contact", (req, res) => {
  res.render("contact"); // Render file contact.ejs
});

// Endpoint untuk mendapatkan data todos
app.get("/todos-data", (req, res) => {
  res.json(todos); // Mengembalikan data todos dalam format JSON
});

app.get("/todo-view", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo", { todos: todos }); 
  });
});

app.get("/todos-list", (req, res) => {
  res.render("todos-page", { todos: todos }); // Merender todos-page.ejs dan meneruskan data todos
});

app.get("/api/todos", (req, res) => {
  console.log("Menerima permintaan GET untuk todos.");
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Berhasil mengirim todos:", todos.length, "item.");
    res.json({ todos: todos });
  });
});

// POST: Menambah todo baru
app.post("/api/todos", (req, res) => {
    const { task } = req.body;
    console.log("Menerima permintaan POST untuk menambah task:", task);

    if (!task) {
        console.error("Task tidak ditemukan di body permintaan.");
        return res.status(400).json({ error: 'Task is required' });
    }
    const query = 'INSERT INTO todos (task, completed) VALUES (?, ?)';
    db.query(query, [task, false], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Todo berhasil ditambahkan dengan ID:", result.insertId);
        res.status(201).json({ 
            message: 'Todo added successfully', 
            id: result.insertId,
            task, 
            completed: false 
        });
    });
});

// PUT: Memperbarui status 'completed' saja
app.put("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    
    console.log('Menerima permintaan PUT untuk ID: ${id} dengan status completed: ${completed}');

    // Validasi input
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: "Invalid 'completed' value. Must be a boolean." });
    }
    
    const query = 'UPDATE todos SET completed = ? WHERE id = ?';

    db.query(query, [completed, id], (err, result) => {
        if (err) {
            console.error("Database update error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
            console.error("Todo tidak ditemukan untuk ID:", id);
            return res.status(404).json({ error: 'Todo not found' });
        }
        console.log('Todo dengan ID ${id} berhasil diperbarui.');
        res.json({ message: 'Todo updated successfully' });
    });
});

// DELETE: Menghapus todo berdasarkan ID
app.delete("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    console.log('Menerima permintaan DELETE untuk ID: ${id}');
    const query = 'DELETE FROM todos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Database delete error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
            console.error("Todo tidak ditemukan untuk ID:", id);
            return res.status(404).json({ error: 'Todo not found' });
        }
        console.log('Todo dengan ID ${id} berhasil dihapus.');
        res.json({ message: 'Todo deleted successfully' });
    });
});

// Middleware untuk menangani 404 Not Found
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

