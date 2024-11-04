const express = require('express');
const path = require('path');
const app = express();
const port = 80;

app.use(express.json());  // Middleware to parse JSON request bodies

const { deleteRow, loadTableData, updateEspRow, updateRoomsRow, generateRoom, getRoomData, changeActiveState, changeDelay, changeMethod } = require('./database_backend_operations');
const { RGBbroker } = require('./broker_stuff');
const { domainToASCII } = require('url');
const { query } = require('./db');

const idColumnMappings = {
  esp: 'esp_id',
  rooms: 'room_id',
  // TODO add the colours table
};

// Endpoint to get all rows of a specific table
app.get('/data', async (req, res) => {
  try {
    const query = `SELECT esp.esp_id, esp.esp_name, module_types.type_name, room_id, number_of_LEDs.number_of_LEDs, module_types.type_name
                   FROM esp
                   LEFT JOIN number_of_LEDs ON number_of_LEDs.esp_id = esp.esp_id
                   LEFT JOIN module_types ON module_types.module_type_ID = esp.module_type_ID;`;
    const data = await loadTableData(query);
    res.json(data);
  } catch (err) {
    console.error('Error loading ESP data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/room-data', async (req, res) => {
  try {
    const query = `SELECT * FROM rooms`;
    const data = await loadTableData(query);
    res.json(data);
  } catch (err) {
    console.error('Error loading room data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

app.post('/generate-room', async (req, res) => {
  data = req.body;
  try {
    const success = await generateRoom(data);
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

app.get('/api/room/:id', (req, res) => {
  const roomId = req.params.id;
  (async () => {
    const data = await getRoomData(roomId);
    res.json(data);
  })();
});

app.post('/api/changeModuleState', (req, res) => {
  (async () => {
    const result = await changeActiveState(req.body.changeActiveStateOf);
    res.json(result);
  })();
});

app.post('/api/changeDelay', (req, res) => {
  (async () => {
    const result = changeDelay(req.body);
    res.json(result);
  })();
});

app.post('/api/changeMethod', (req, res) => {
  (async () => {
    const result = changeMethod(req.body);
    res.json(result);
  })();
});

app.post('/api/RGBbroker', async (req, res) => {
    try {
        console.log('Message arrived:', req.body); // Use req.body directly to see the parsed object
        const room_id = req.body.room_id;
        const r = req.body.r;
        const g = req.body.g;
        const b = req.body.b;

        const result = await RGBbroker(room_id, r, g, b);
        res.status(200).send('Success'); // Send a response back to the client
    } catch (error) {
        console.error('Error handling RGBbroker request:', error);
        res.status(500).send('Internal Server Error');
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

app.get('/room/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'controls.html'));
});

// Serve static files from the 'public' directory
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});