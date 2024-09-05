const express = require('express');
const path = require('path');
const app = express();
const port = 80;

const {deleteRow, loadEspData} = require('./database_backend_operations');

const idColumnMappings = {
  esp: 'esp_id',
  room: 'room_id',
  // TODO add the colours table
};

// Endpoint to get all rows of a specific table
app.get('/data', (req, res) => {
  loadEspData(req, res);
});

app.delete('/delete/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  const idColumn = idColumnMappings[tableName]; // Get the column name for the table
  console.log(`Received a delete request: Table=${tableName}, ID=${id}`);

  if (!idColumn) {
    return res.status(400).json({ error: 'ID column not defined for this table' });
  }

  try {
    const success = await deleteRow(tableName, idColumn, id);
    if (success) {
      res.status(200).json({ message: 'Row deleted successfully' });
    } else {
      res.status(404).json({ message: 'Row not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/updateEspRow', (req, res) => {
  updateEspRow(req, res);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});