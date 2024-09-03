const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 80;

/* databaza connect */ 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'newpassword',
  database: 'smart_data'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Endpoint to get all rows of a specific table
app.get('/data', (req, res) => {
  const tableName = 'esp';
  const query = `SELECT * FROM ${tableName}`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving data from the database');
      return;
    }
    res.json(results);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
