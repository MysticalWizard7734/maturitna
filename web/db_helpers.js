const pool = require('./db'); // Import the pool from db.js


async function executeQuery(query, params = []) {
    var result = [];

    if (!Array.isArray(params)) {
        params = [params];
    }
/*
    // Check for null values in `params`
    if (params.some(param => param === null)) {
        throw new Error('Params array includes null value(s)');
    }
*/
    try {
        [result] = await pool.execute(query, params);
        if (!result) result = []; // ak nie su ziadne zhody vrati sa prazdna array
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
    return result;
}

module.exports = { executeQuery };