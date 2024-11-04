const mqtt = require('mqtt');

const { loadTableData } = require('./database_backend_operations');
const { query } = require('./db');

const client = mqtt.connect('mqtt://127.0.0.1');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

// Error handling
client.on('error', (error) => {
    console.error('Connection error:', error);
}); 

async function RGBbroker(room_id, r, g, b){

    const query = `SELECT * FROM rooms WHERE room_id = ?`;

    const roomDataArray = await loadTableData(query, room_id);
    const roomData = roomDataArray[0];

    console.log(roomData);

    const query2 = `SELECT esp.esp_id, number_of_LEDs.number_of_LEDs 
                    FROM esp 
                    LEFT JOIN number_of_LEDs ON number_of_LEDs.esp_id = esp.esp_id 
                    WHERE esp.room_id = ? AND esp.isActive = 1 AND esp.module_type_ID = 0;`;

    const espData = await loadTableData(query2, room_id);

    console.log(espData);

    espData.forEach(esp => {
        const topic = esp.esp_id;
        const message = {
            LED_delay: roomData.LED_delay,
            LED_method: roomData.LED_method,
            number_of_LEDs: esp.number_of_LEDs,
            r: r,
            g: g,
            b: b
        }

        client.publish(topic, JSON.stringify(message), {qos: 0}, (err) => {
            if(err){
                console.log('Publish error: ' + err );
            }
            else{
                console.log('Successful publish on topic: ' + topic);
            }
        });
    });
}

module.exports = {RGBbroker};
