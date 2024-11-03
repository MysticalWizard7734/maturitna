const mqtt = require('mqtt');

const { selectActiveEsps } = require('./database_backend_operations');

const client = mqtt.connect('mqtt://127.0.0.1');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

// Error handling
client.on('error', (error) => {
    console.error('Connection error:', error);
}); 

async function RGBbroker(req){
    console.log(req);

    const room_id = req.room_id;

    const r = req.r;
    const g = req.g;
    const b = req.g;

    const esp = await selectActiveEsps(room_id);


    var result = [];

    esp.forEach(esp => {
        console.log(esp.esp_id);
        client.publish(esp.esp_id, `${r}, ${g}, ${b}`);
    });

    return result;
}

module.exports = {RGBbroker};
