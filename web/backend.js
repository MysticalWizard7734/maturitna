const express = require('express');
const path = require('path');
const app = express();
const port = 80;

app.use(express.json());  // Middleware to parse JSON request bodies

const { deleteRow, loadTableData, updateEspRow, updateRoomsRow, generateRoom } = require('./database_backend_operations');

const idColumnMappings = {
  esp: 'esp_id',
  rooms: 'room_id',
  // TODO add the colours table
};

// Endpoint to get all rows of a specific table
app.get('/data', (req, res) => {
  loadTableData('esp', req, res);
});

app.get('/room-data', (req, res) => {
  loadTableData('rooms', req, res);
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

app.post('/updateRoomsRow', async (req, res) => {
  data = req.body;
  try {
    const success = await updateRoomsRow(data);
    if (success) {
      res.status(200).json({ message: 'Row edited successfully' });
    } else {
      res.status(404).json({ message: 'Row not found' });
    }
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      console.log('Sending client error response');
      console.log(err.message);
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/generate-table', async (req, res) =>{
  data = req.body;
  try{
    const success = await generateRoom();
    console.log(success);
    if (success) {
      res.status(200).json({ message: 'Row generated successfully' });
    } else {
      res.status(404).json({ message: 'Row not found' });
    }
  }
  catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/updateEspRow', async (req, res) => {
  data = req.body;
  try {
    const success = await updateEspRow(data);
    if (success) {
      res.status(200).json({ message: 'Row edited successfully' });
    } else {
      res.status(404).json({ message: 'Row not found' });
    }
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      console.log('Sending client error response');
      console.log(err.message);
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/esp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'esp.html'));
})

app.get('/rooms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rooms.html'));
})

// Serve static files from the 'public' directory
app.use(express.static('public'));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});