const pool = require('./db'); // Import the pool from db.js

async function deleteRow(tableName, idColumn, idValue) {
    const query = `DELETE FROM \`${tableName}\` WHERE \`${idColumn}\` = ?`;
    console.log(query);
    try {
        const [result] = await pool.execute(query, [idValue]);
        console.log(`Deleted rows: ${result.affectedRows}`);
        return result.affectedRows > 0;
    } catch (err) {
        console.error('Error executing delete query:', err);
        throw err;
    }
}

async function loadTableData(table, req, res) {
    const query = `SELECT * FROM ${table}`;

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

    const [row] = await pool.execute('SELECT * FROM esp WHERE esp.esp_id = ?', [esp_id]);
    const oldValues = row[0];  // Get the first row from the result

    if (!isNaN(parseInt(number_of_LEDs, 10))) number_of_LEDs = parseInt(number_of_LEDs, 10);
    else if (number_of_LEDs === '') number_of_LEDs = null;
    else number_of_LEDs = oldValues.number_of_LEDs;

    if (!isNaN(parseInt(room_id, 10))) room_id = parseInt(room_id, 10);
    else if (room_id === '') room_id = null;
    else room_id = oldValues.room_id;

    module_type_ID = module_type_ID.toUpperCase();

    if (module_type_ID === '') module_type_ID = null;
    else if (module_type_ID === 'REL') module_type_ID = true;
    else if (module_type_ID === 'RGB') module_type_ID = false;
    else if (module_type_ID === '') module_type_ID = null;
    else module_type_ID = oldValues.module_type_ID;

    number_of_LEDs = isNaN(parseInt(number_of_LEDs, 10)) ? oldValues.number_of_LEDs : parseInt(number_of_LEDs, 10);

    room_id = isNaN(parseInt(room_id, 10)) ? oldValues.room_id : parseInt(room_id, 10);


    console.log(esp_name);
    esp_name = (esp_name.trim() === '') ? null : esp_name.trim();
    console.log(esp_name);
    
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


async function updateRoomsRow(data) {
    console.log('Rooms row updating');

    console.log(data);

    let { room_id, room_name } = data;

    console.log(room_id);
    console.log(room_name);

    room_name = (room_name.trim() === '') ? null : room_name.trim();
    
    const updateQuery = `
    UPDATE rooms 
    SET 
        room_name = ?
    WHERE 
        room_id = ?`;

    try {
        const [result] = await pool.execute(updateQuery, [room_name, room_id]);
        console.log(`Updated row: ${result.affectedRows}`);
        return result.affectedRows > 0;
    }
    catch (err) {
        console.error('Error executing update query:', err);
        throw err;
    }
}

async function generateRoom(){
    const query = `INSERT INTO rooms () VALUES ()`;

    try {
        const [result] = await pool.execute(query);
        console.log(`Updated row: ${result.affectedRows}`);
        return result.affectedRows > 0;
    }
    catch (err) {
        console.error('Error executing update query:', err);
        throw err;
    }
}

module.exports = { deleteRow, loadTableData, updateEspRow, updateRoomsRow, generateRoom };