const pool = require('./db'); // Import the pool from db.js

async function deleteRow(tableName, idColumn, idValue) {
    const query = `DELETE FROM \`${tableName}\` WHERE \`${idColumn}\` = ?`;
    try {
        const [result] = await pool.execute(query, [idValue]);
        console.log(`Deleted rows: ${result.affectedRows}`);
        return result.affectedRows > 0;
    } catch (err) {
        console.error('Error executing delete query:', err);
        throw err;
    }
}

async function loadEspData(req, res){
    const tableName = 'esp';
    const query = `SELECT * FROM ${tableName}`;
    
    try {
        const [result] = await pool.execute(query);
        res.json(result);
    } catch (err) {
        console.error('Error executing load query:', err);
        throw err;
    }
}

async function updateEspRow(req, res){
    const data = req.body;

    const query = `DELETE FROM \`${tableName}\` WHERE \`${idColumn}\` = ?`;
    
    //todo
    //UPDATE (esp_name, number_of_LEDs, module_type_ID, room_id) WHERE esp_id = esp_id;

    try {
        
    } catch (err) {
        console.error('Error executing update query:', err);
        throw err;
    }
}

module.exports = {deleteRow, loadEspData};