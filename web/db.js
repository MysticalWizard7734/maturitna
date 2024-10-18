const mysql = require('mysql2/promise');

/* databaza connect */
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'newpassword',
    database: 'smart_data',
    connectionLimit: 10 // Adjust the limit based on your needs
});


module.exports = pool;