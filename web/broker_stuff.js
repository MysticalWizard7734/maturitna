const mqtt = require('mqtt');

const { executeQuery } = require('./db_helpers');
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
    const query2 = `SELECT esp.esp_id
                    FROM esp
                    WHERE esp.room_id = ? AND esp.isActive = 1 AND esp.module_type_ID = 0;`;

    const espData = await executeQuery(query2, room_id);

    console.log(espData);

    espData.forEach(esp => {
        const topic = esp.esp_id;
        const message = {
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

function RGBbrokerData(esp_id, LED_delay, LED_method, number_of_LEDs) {
    const topic = esp_id;
    const message = {
        LED_delay: LED_delay,
        LED_method: LED_method,
        number_of_LEDs: number_of_LEDs
    }

    client.publish(topic, JSON.stringify(message), {qos: 1}, (err) => {
        if(err){
            console.log('Publish error: ' + err );
        }
        else{
            console.log('Successful publish on topic: ' + topic);
        }
    });
}

function RELBroker(esp_id){
    const topic = esp_id;
    const message = "\n";

    client.publish(topic, message, {qos: 0}, (err) => {
        if(err){
            console.log('Publish error: ' + err );
        }
        else{
            console.log('Successful publish on topic: ' + topic);
        }
    });

}

module.exports = {RGBbroker, RGBbrokerData, RELBroker};
