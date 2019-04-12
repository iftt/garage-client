const GarageClient = require('./lib/index.js').default;

const garageClient = new GarageClient({
  tangleLocation: 'https://nodes.devnet.iota.org',
  fpgaPort: '/dev/ttyUSB1'
});
