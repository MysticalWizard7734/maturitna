function insert_msg(msg) {

  msg = msg.toString();

  let parts = msg.split('-');
  let id = parts[0];     // id
  let modType = parts[1]; // type


  const mysql = require('mysql2');

  // Create a connection to the MySQL database
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'newpassword',
    database: 'smart_data'
  });

  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err.stack);
      return;
    }
    console.log('Connected to MySQL database as id', connection.threadId);
  });

  // Insert into MySQL database
  connection.query('INSERT INTO esp (ESP_ID, module_type_ID) VALUES (?, ?)', [parts[0], parts[1]], (error, results, fields) => {
    if (error) {
      console.error('Error inserting into database:', error);
      return;
    }
    console.log('Inserted a new record into esp with id:', results.insertId);

    if(parts[1] === '0'){
      connection.query('INSERT INTO number_of_LEDs (esp_id) VALUES (?)', parts[0], (error, results, fields) => {
        if (error) {
          console.error('Error inserting into database:', error);
          return;
        }
        console.log('Inserted a new record into esp with id:', results.insertId);
      });
    }

    // Close the connection after insertion
    connection.end((err) => {
      if (err) {
        console.error('Error closing database connection:', err.stack);
        return;
      }
      console.log('Database connection closed.');
    });
  });
}

module.exports = insert_msg;