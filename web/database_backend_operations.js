const pool = require('./db'); // Import the pool from db.js
const { RGBbrokerData } = require('./broker_stuff.js');
const { executeQuery } = require('./db_helpers.js');

async function updateEspRow(data) {

    console.log('New data:');
    console.log(data);

    let { esp_id, esp_name, number_of_LEDs, module_type_ID, room_id } = data;

    //get old values to use if new values are of incorrect type
    const queryOldSelect = `
    SELECT esp.esp_id, esp.esp_name, esp.module_type_ID, esp.room_id, number_of_LEDs.number_of_LEDs 
    FROM esp
    LEFT JOIN number_of_LEDs ON esp.esp_id = number_of_LEDs.esp_id
    WHERE esp.esp_id = ?;`;

    let oldData;

    [oldData] = await executeQuery(queryOldSelect, esp_id);

    console.log('Old data:');
    console.log(oldData);

    let { esp_id: old_esp_id, esp_name: old_esp_name, number_of_LEDs: old_number_of_LEDs, module_type_ID: old_module_type_ID, room_id: old_room_id } = oldData;

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

    let roomIdOutput = [];

    console.log(room_id);

    if (room_id !== null) {
        [roomIdOutput] = await executeQuery(checkForRoomId, room_id);

        if (roomIdOutput.length === 0) room_id = old_room_id;
        else {
            LED_delay = roomIdOutput.LED_delay;
            LED_method = roomIdOutput.LED_method;
        }
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
            WHERE esp_id = ?;`;

        console.log('number_of_LEDs je: ' + number_of_LEDs + ' a ma hodnotu: ' + typeof number_of_LEDs);
        console.log('esp_id je: ' + esp_id + ' a ma hodnotu: ' + typeof esp_id);

        await executeQuery(EditNumberOfLedsQuery, [number_of_LEDs, esp_id]);
    }

    if (room_id !== old_room_id || (module_type_ID === 0 && number_of_LEDs !== old_number_of_LEDs)) {
        console.log('Sending new data to the ESP');
        try {
            RGBbrokerData(esp_id, LED_delay, LED_method, number_of_LEDs);
        }
        catch (err) {
            console.error('Error sending data to broker:', err);
            throw err;
        }
    }

    const result = await executeQuery(queryMainInsert, [esp_name, module_type_ID, room_id, esp_id]);
    console.log(`Updated row: ${result.affectedRows}`);
    return result.affectedRows > 0;
}


async function updateRoomsRow(data) {
    console.log('Rooms row updating');

    console.log(data);

    let { room_id, room_name, LED_delay, LED_method } = data;

    console.log(room_id);
    console.log(room_name);
    console.log(LED_delay);
    console.log(LED_method);

    //room_name = (room_name.trim() === '') ? null : room_name.trim();

    const updateQuery = `
    UPDATE rooms 
    SET 
        room_name = ?, 
        LED_delay = ?, 
        LED_method = ?
    WHERE 
        room_id = ?`;

    const result = await executeQuery(updateQuery, [room_name, LED_delay, LED_method, room_id]);
    console.log(`Updated row: ${result.affectedRows}`);
    return result.affectedRows > 0;
}

async function generateRoom(data) {
    console.log('Generating a new room');
    console.log(data);

    let { roomNumber, roomName } = data;
    const query = `INSERT INTO rooms (room_id, room_name) VALUES (?, ?)`;

    const result = await executeQuery(query, [roomNumber, roomName]);
    console.log(`Generated row: ${result.affectedRows}`);
    return result.affectedRows > 0;
}

module.exports = { updateEspRow, updateRoomsRow, generateRoom};