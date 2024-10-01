const pool = require('./db'); // Import the pool from db.js

async function deleteRow(tableName, idColumn, idValue) {
    const query = ` 
                    DELETE FROM \`${tableName}\` WHERE \`${idColumn}\` = ?`;
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

    const queryRooms = `SELECT * FROM rooms`;

    const queryEsp = `SELECT esp.esp_id, esp.esp_name, module_types.type_name, room_id, number_of_LEDs.number_of_LEDs, module_types.type_name
                      FROM esp
                      LEFT JOIN number_of_LEDs ON number_of_LEDs.esp_id = esp.esp_id
                      LEFT JOIN module_types ON module_types.module_type_ID = esp.module_type_ID;`;

    const query = (table === 'rooms') ? queryRooms : queryEsp;

    try {
        const [result] = await pool.execute(query);
        res.json(result);
    } catch (err) {
        console.error('Error executing load query:', err);
        throw err;
    }
}

async function updateEspRow(data) {
    let { esp_id, esp_name, number_of_LEDs, module_type_ID, room_id } = data;

    //get old values to use if new values are of incorrect type
    const queryOldSelect = `
        SELECT esp.esp_id, esp.esp_name, number_of_LEDs.number_of_LEDs, esp.module_type_ID, esp.room_id 
        FROM esp
        LEFT JOIN number_of_LEDs ON esp.esp_id = number_of_LEDs.esp_id
        WHERE esp.esp_id = ?;
    `;

    let oldData;
    try {
        [oldData] = await pool.execute(queryOldSelect, [esp_id]);
    }
    catch (err) {
        console.error('Error reading old values:', err);
        throw err;
    }
    let { esp_id: old_esp_id, esp_name: old_esp_name, number_of_LEDs: old_number_of_LEDs, module_type_ID: old_module_type_ID, room_id: old_room_id } = oldData[0];

    const queryMainInsert = `
        UPDATE esp 
        SET 
            esp_name = ?,
            module_type_id = ?,
            room_id = ?
        WHERE 
            esp_id = ?;
        `;

    if (module_type_ID === 'RGB') module_type_ID = 0;
    else if (module_type_ID === 'REL') module_type_ID = 1;

    if (!isNaN(parseInt(room_id, 10))) room_id = parseInt(room_id, 10);
    else if (room_id === '') room_id = null;
    else room_id = old_room_id;

    const checkForRoomId = `
    SELECT room_id 
    FROM rooms
    WHERE room_id = ?
    `;

    let roomIdOutput;
    try {
        [roomIdOutput] = await pool.execute(checkForRoomId, [room_id]);
    }
    catch (err) {
        console.error('Error reading room IDs:', err);
        throw err;
    }
    if (roomIdOutput.length === 0) room_id = old_room_id;

    if (!isNaN(parseInt(number_of_LEDs, 10))) number_of_LEDs = parseInt(number_of_LEDs, 10);
    else if (number_of_LEDs === '') number_of_LEDs = null;
    else number_of_LEDs = old_number_of_LEDs;

    let moduleEditQuery;

    if (module_type_ID === 0) {

        moduleEditQuery = `
            UPDATE number_of_LEDs
            SET 
                number_of_LEDs = ?
            WHERE esp_id = ?;
            `;

        try {
            pool.execute(moduleEditQuery, [number_of_LEDs, esp_id]);
        }
        catch (err) {
            console.error('Error updating row in number_of_LEDs table:', err);
            throw err;
        }

    }

    try {
        const [result] = await pool.execute(queryMainInsert, [esp_name, module_type_ID, room_id, esp_id]);
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

async function generateRoom() {
    console.log('Generating a new room');
    const query = `INSERT INTO rooms () VALUES ()`;

    try {
        const [result] = await pool.execute(query);
        console.log(`Generated row: ${result.affectedRows}`);
        return result.affectedRows > 0;
    }
    catch (err) {
        console.error('Error executing update query:', err);
        throw err;
    }
}

module.exports = { deleteRow, loadTableData, updateEspRow, updateRoomsRow, generateRoom };