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

async function loadEspData(req, res) {
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

async function updateEspRow(data) {
    console.log('Esp row updating');

    let { esp_id, esp_name, number_of_LEDs, module_type_ID, room_id } = data;

    const [oldValues] = await pool.execute('SELECT * FROM esp WHERE esp.esp_id = ?', [esp_id]);
    console.log(oldValues);

    /*if (typeof module_type_ID !== 'object' || !Buffer.isBuffer(module_type_ID)) module_type_ID = oldValues.module_type_ID;*/

    if(number_of_LEDs === !isNaN(parseInt(number_of_LEDs, 10))) number_of_LEDs = parseInt(number_of_LEDs, 10);
    else if(number_of_LEDs === '') number_of_LEDs = null;
    else number_of_LEDs = oldValues.number_of_LEDs;

    

    room_id = room_id === '' ? null : room_id;
    esp_name = esp_name === '' ? null : esp_name
    if (module_type_ID === '') module_type_ID = null;
    else if (module_type_ID === 'REL') module_type_ID = true;
    else module_type_ID = false;

    number_of_LEDs = isNaN(parseInt(number_of_LEDs, 10)) ? oldValues.number_of_LEDs : parseInt(number_of_LEDs, 10);
    room_id = isNaN(parseInt(room_id, 10)) ? oldValues.room_id : parseInt(room_id, 10);
    esp_name = esp_name.trim() === '' ? null : esp_name.trim();

    console.log(data);

    const updateQuery = `
    UPDATE esp 
    SET 
        esp_name = ?, 
        number_of_LEDs = ?, 
        module_type_ID = ?, 
        room_id = ? 
    WHERE 
        esp_id = ?`;

    try {
        const [result] = await pool.execute(updateQuery, [esp_name, number_of_LEDs, module_type_ID, room_id, esp_id]);
        console.log(`Updated row: ${result.affectedRows}`);
        return result.affectedRows > 0;
    }
    catch (err) {
        console.error('Error executing update query:', err);
        throw err;
    }
}

module.exports = { deleteRow, loadEspData, updateEspRow };