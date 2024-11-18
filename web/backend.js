const express = require('express');
const path = require('path');
const app = express();
const port = 80;

app.use(express.json());  // Middleware to parse JSON request bodies

const { updateEspRow, updateRoomsRow, generateRoom,} = require('./database_backend_operations');
const { executeQuery } = require('./db_helpers');
const { RGBbroker, RELBroker } = require('./broker_stuff');
const { domainToASCII } = require('url');
const { query } = require('./db');
const { error } = require('console');

const idColumnMappings = {
  esp: 'esp_id',
  rooms: 'room_id',
  // TODO add the colours table
};

// this is fine
// Endpoint to get all rows of a specific table
app.get('/data', async (req, res) => {
  try {
    const query = `SELECT esp.esp_id, esp.esp_name, module_types.type_name, room_id, number_of_LEDs.number_of_LEDs, module_types.type_name
                   FROM esp
                   LEFT JOIN number_of_LEDs ON number_of_LEDs.esp_id = esp.esp_id
                   LEFT JOIN module_types ON module_types.module_type_ID = esp.module_type_ID;`;
    const data = await executeQuery(query);
    res.json(data);
  } catch (err) {
    handleError(err, res);
  }
});

// this is fine
// Endpoint to get all rows of a specific table
app.get('/room-data', async (req, res) => {
  try {
    const query = `SELECT * FROM rooms`;
    const data = await executeQuery(query);
    res.json(data);
  } catch (err) {
    handleError(err, res);
  }
});

app.delete('/delete/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  const idColumn = idColumnMappings[tableName]; // Get the column name for the table
  console.log(`Received a delete request: Table=${tableName}, ID=${id}`);

  if (!idColumn) {
    return res.status(400).json({ error: 'ID column not defined for this table' });
  }

  const query = `DELETE FROM \`${tableName}\` WHERE \`${idColumn}\` = ?`;

  try {
    const result = await executeQuery(query, id);
    if (result.affectedRows) {
      res.status(200).json({ message: 'Row deleted successfully' });
    } else {
      res.status(404).json({ message: 'Row not found' });
    }
  } catch (err) {
    handleError(err, res);
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
    handleError(err, res);
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
    handleError(err, res);
  }
});

app.post('/updateEspRow', async (req, res) => {
  data = req.body;
  try {
    const result = await updateEspRow(data);
    if (!result.affectedRows) {
      res.status(200).json({ message: 'Row edited successfully' });
    } else {
      res.status(404).json({ message: 'Row not found' });
    }
  } catch (err) {
    handleError(err, res);
  }
});

app.get('/api/room/:id', (req, res) => {
  const roomId = req.params.id;
  (async () => {

    const query1 = `SELECT * FROM rooms WHERE room_id = ?`;
    const query2 = `SELECT * FROM esp WHERE room_id = ?`;
    try {
      const roomData = await executeQuery(query1, roomId);
      try {
        const esps = await executeQuery(query2, roomId);

        const response = {
          room: roomData[0],
          modules: esps
        };

        res.json(response);
      }
      catch (err) {
        handleError(err, res);
      }
    }
    catch (err) {
      handleError(err, res);
    }
  })();
});

app.post('/api/relChangeState', (req, res) => {
  const esp_id = req.body.esp_id;
  RELBroker(esp_id);
});

app.post('/api/changeModuleState', (req, res) => {
  (async () => {
    const query = `UPDATE esp SET isActive = 1 - isActive WHERE esp_id = ?`;
    try{
    const result = await executeQuery(query, req.body.changeActiveStateOf);
    res.json(result);
    }
    catch(err){
      handleError(err, res);
    }
  })();
});

app.post('/api/changeDelayMethod', (req, res) => {
  (async () => {
    const result = updateRoomsRow(req.body) 
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

function handleError(err, res) {
  const errorMessages = [
    'Unknown column in',
    'Duplicate entry',
    'Access denied',
    'Invalid parameter',
    'Request failed',
    'Field cannot be empty',
    'Unexpected token',
    'Failed to fetch',
    'No route found',
    'Module already exists',
    'Failed to connect'
  ]; 
  console.log('Error: ' + err);
  const matchedError = errorMessages.find(errorText => err.message.includes(errorText));

  if (matchedError) {
    console.log('Matched a bad request');
    res.status(400).json({ error: `Bad request: ${matchedError}` });
  } else {
    console.log('Server error');
    res.status(500).json({ error: 'Internal server error' });
  }
}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});