const GarageClient = require('./lib/index.js').default

GarageClient({
  tangleLocation: 'https://nodes.devnet.iota.org',
  fpgaPort: '/dev/ttyUSB1'
})
