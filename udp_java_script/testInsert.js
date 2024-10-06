const dgram = require('dgram');
const client = dgram.createSocket('udp4');

// Define the ID and module type to send
const id = "ESP_1111122222";
const modType = "0"; // This will trigger the second INSERT into 'number_of_LEDs'

// Combine them with a delimiter
const message = `${id}-${modType}`;  // Same delimiter as in your Arduino code

// Send the packet to the server
const PORT = 12345;  // Replace with the actual port the server is listening on
const HOST = 'localhost';  // Replace with actual host/IP of your server

client.send(message, PORT, HOST, (err) => {
  if (err) {
    console.error('Error sending message:', err);
    client.close();
    return;
  }
  console.log(`Message sent: ${message}`);
  client.close();
});