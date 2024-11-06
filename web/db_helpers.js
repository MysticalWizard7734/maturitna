const pool = require('./db'); // Import the pool from db.js


async function loadTableData(query, params = []) {
    var result = [];

    try {
        [result] = await pool.execute(query, [params]);
    } catch (err) {
        console.error('Error executing load query:', err);
        throw err;
    }
    return result;
}

module.exports = { loadTableData };