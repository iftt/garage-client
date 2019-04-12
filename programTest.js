const ioClient = require('socket.io-client');
const weatherProgram = require('./test/weatherProgram.json');
const clientLocation = '192.168.0.26:8001';

const socketClient = ioClient.connect(`http://${clientLocation}`);

socketClient.on('ready', client => {
  console.log('lets try programming...');
  socketClient.emit('program', [weatherProgram]);
  // socketClient.emit('program', []);
  socketClient.close();
});
