const pool = require('./db'); // Import the pool from db.js
const { RGBbrokerData } = require('./broker_stuff.js');

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

async function updateEspRow(data) {

    console.log('New data:');
    console.log(data);

    let { esp_id, esp_name, number_of_LEDs, module_type_ID, room_id } = data;

    //get old values to use if new values are of incorrect type
    const queryOldSelect = `
    SELECT esp.esp_id, esp.esp_name, esp.module_type_ID, esp.room_id, number_of_LEDs.number_of_LEDs 
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

    console.log('Old data:');
    console.log(oldData[0]);

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

    //preklada sa module type z stringu na int ako id
    if (module_type_ID === 'RGB') module_type_ID = 0;
    else if (module_type_ID === 'REL') module_type_ID = 1;

    //kontrola ci cislo je cislo
    if (!isNaN(parseInt(room_id, 10))) room_id = parseInt(room_id, 10);
    else if (room_id === '') room_id = null;
    else room_id = old_room_id;

    //check ci cislo izby existuje
    const checkForRoomId = `
    SELECT room_id, LED_delay, LED_method
    FROM rooms
    WHERE room_id = ?
    `;
    
    let LED_delay = null;
    let LED_method = null;

    let roomIdOutput;
    try {
        [roomIdOutput] = await pool.execute(checkForRoomId, [room_id]);
    }
    catch (err) {
        console.error('Error reading room IDs:', err);
        throw err;
    }
    if (roomIdOutput.length === 0) room_id = old_room_id;
    else {
        LED_delay = roomIdOutput[0].LED_delay;
        LED_method = roomIdOutput[0].LED_method;
        console.log('LED_delay: ' + LED_delay);
        console.log('LED_method: ' + LED_method);
    }

    //kontrola ci number_of_leds je cislo
    if (!isNaN(parseInt(number_of_LEDs, 10))) number_of_LEDs = parseInt(number_of_LEDs, 10);
    else if (number_of_LEDs === '') number_of_LEDs = null;
    else number_of_LEDs = old_number_of_LEDs;

    //edit poctu lediek
    let EditNumberOfLedsQuery;

    if (module_type_ID === 0) {

        EditNumberOfLedsQuery = `
            UPDATE number_of_LEDs
            SET 
                number_of_LEDs = ?
            WHERE esp_id = ?;
            `;

        try {
            await pool.execute(EditNumberOfLedsQuery, [number_of_LEDs, esp_id]);
        }
        catch (err) {
            console.error('Error updating row in number_of_LEDs table:', err);
            throw err;
        }

    }

    if (room_id !== old_room_id || (module_type_ID === 0 && number_of_LEDs !== old_number_of_LEDs)) {
        console.log('Sending new data to the ESP');
        try{
            RGBbrokerData(esp_id, LED_delay, LED_method, number_of_LEDs);
        }
        catch (err){
            console.log(err);
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

async function generateRoom(data) {
    console.log('Generating a new room');
    console.log(data);

    let { roomNumber, roomName } = data;
    const query = `INSERT INTO rooms (room_id, room_name) VALUES (?, ?)`;

    try {
        const [result] = await pool.execute(query, [roomNumber, roomName]);
        console.log(`Generated row: ${result.affectedRows}`);
        return result.affectedRows > 0;
    }
    catch (err) {
        console.error('Error executing update query:', err);
        throw err;
    }
}

async function getRoomData(roomId) {
    console.log('Loading data about room number: ' + roomId);
    let roomData;
    let correspondingModules;


    const roomNameQuery = `SELECT * FROM rooms WHERE room_id = ?`;
    try {
        [roomData] = await pool.execute(roomNameQuery, [roomId]);
    }
    catch (err) {
        console.log('Error loading room name: ' + err);
    }

    const query = `SELECT * FROM esp WHERE room_id = ?`;

    try {
        [correspondingModules] = await pool.execute(query, [roomId]);
    }
    catch (err) {
        console.log('Error loading modules: ' + err);
    }

    const response = {
        room: roomData[0],
        modules: correspondingModules
    };

    return response;
}

async function changeActiveState(esp_id) {

    const query = `UPDATE esp SET isActive = 1 - isActive WHERE esp_id = ?`;

    var result = [];

    try {
        [result] = await pool.execute(query, [esp_id]);
        console.log(result.info);
    }
    catch (err) {
        console.log('Error changing state: ' + err);
        result = err;
    }
    
    return result;
}

async function changeDelay(req) {
    const query = `UPDATE rooms SET LED_delay = ? WHERE room_id = ? `;

    var result = [];

    try {
        [result] = await pool.execute(query, [req.LED_delay, req.room_id]);
        const esp_query = `SELECT esp_id FROM esp WHERE room_id = ? AND module_type_ID = 0`;

        var esps = [];
        try{
            [esps] = await pool.execute(esp_query, [req.room_id])
            esps.forEach(esp => {
                RGBbrokerData(esp.esp_id, req.LED_delay, -1, -1);
            });
        }
        catch (err){
            console.log('Error: ' + err);
        }
    
    }
    catch (err) {
        console.log('Error: ' + err);
    }
    return result.info;
}

async function changeMethod(req) {
    const query = `UPDATE rooms SET LED_method = ? WHERE room_id = ? `;

    var result = [];

    try {
        [result] = await pool.execute(query, [req.LED_method, req.room_id]);
        const esp_query = `SELECT esp_id FROM esp WHERE room_id = ? AND module_type_ID = 0`;

        var esps = [];
        try{
            [esps] = await pool.execute(esp_query, [req.room_id])
            esps.forEach(esp => {
                RGBbrokerData(esp.esp_id, -1, req.LED_method, -1);
            });
        }
        catch (err){
            console.log('Error: ' + err);
        }
    
    }
    catch (err) {
        console.log('Error: ' + err);
    }
    return result.info;
}

module.exports = { deleteRow, loadTableData, updateEspRow, updateRoomsRow, generateRoom, getRoomData, changeActiveState, changeDelay, changeMethod };