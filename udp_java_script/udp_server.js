const insert_msg = require('./insert_msg.js');

const dgram = require('dgram');

const UDP_PORT = 12345;
const MESSAGE = Buffer.from('Tu server');

const server = dgram.createSocket('udp4');

server.on('listening', () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
  console.log(`Received message from ${rinfo.address}:${rinfo.port}: ${msg}`);

  insert_msg(msg);

  // Send response back
  server.send(MESSAGE, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error('Error sending response:', err);
    } else {
      console.log(`Sent response to ${rinfo.address}:${rinfo.port}`);
    }
  });
});

server.bind(UDP_PORT, '0.0.0.0');