const GarageClient = require('./lib/index.js').default

new GarageClient({
  tangleLocation: 'https://nodes.devnet.iota.org',
  fpgaPort: '/dev/ttyUSB1'
})
