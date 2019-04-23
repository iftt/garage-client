const garageProtocol = require('./src/garageProtocol.json')

const TryteBuffer = require('@iftt/tryte-buffer').default
const tryteBuffer = new TryteBuffer(garageProtocol)

const decodedTrytes = tryteBuffer.decode('D9HNWPNA')

console.log(decodedTrytes)
