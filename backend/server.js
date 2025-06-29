console.log("This is the CORRECT server.js running...");

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'task3_db'
});

db.connect(err => {
    if (err) {
        console.error('DB connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// ------------------- NOTES ROUTES -------------------


app.get('/notes', (req, res) => {
    console.log("GET /notes called");
    db.query('SELECT * FROM notes ORDER BY updated_at DESC', (err, results) => {
        console.log("DB callback hit, err=", err);  // << forced log
        if (err) {
            console.log("MYSQL ERROR:", err);   // << forced log
            return res.status(500).json({ error: "Failed to fetch notes" });
        }
        res.json(results);
    });
});


// Create new note
app.post('/notes', (req, res) => {
    console.log("POST /notes called with", req.body);
    const { title, content } = req.body;
    db.query('INSERT INTO notes (title, content) VALUES (?, ?)', 
        [title, content], 
        (err, result) => {
            if (err) {
                console.error("MYSQL ERROR:", err);
                return res.status(500).json({ error: "Failed to create note" });
            }
            res.json({ id: result.insertId, title, content, updated_at: new Date() });
        }
    );
});

// Update 
app.put('/notes/:id', (req, res) => {
    console.log("PUT /notes called with id:", req.params.id);
    const { id } = req.params;
    const { title, content } = req.body;
    db.query('UPDATE notes SET title = ?, content = ? WHERE id = ?', 
        [title, content, id], 
        (err) => {
            if (err) {
                console.error("MYSQL ERROR:", err);
                return res.status(500).json({ error: "Failed to update note" });
            }
            res.json({ id, title, content, updated_at: new Date() });
        }
    );
});

// Delete 
app.delete('/notes/:id', (req, res) => {
    console.log(" DELETE /notes called with id:", req.params.id);
    const { id } = req.params;
    db.query('DELETE FROM notes WHERE id = ?', [id], (err) => {
        if (err) {
            console.error("MYSQL ERROR:", err);
            return res.status(500).json({ error: "Failed to delete note" });
        }
        res.json({ message: "Note deleted" });
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
