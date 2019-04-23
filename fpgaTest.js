const SerialPort = require('serialport')
const { asciiToTrytes } = require('@iota/converter')
const Mam = require('@iftt/mam')

const port = new SerialPort('/dev/ttyUSB1', {
  baudRate: 115200
})

port.on('open', () => {
  console.log('port is open!')
  // Because there's no callback to write, write errors will be emitted on the port:
  let mamState = Mam.init({
    provider: 'https://nodes.devnet.iota.org',
    // provider: 'https://nodes.thetangle.org:443',
    attachToTangle: function (trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) {
      return new Promise((resolve, reject) => {
        let bytestream = Buffer.from(JSON.stringify({
          command: 'attachToTangle',
          trunkTransaction,
          branchTransaction,
          minWeightMagnitude,
          timestamp: new Date().getTime(),
          trytes
        }) + '\n')
        let returnedTrytes = Buffer.from('')
        // let totalSize = 0;
        port.on('data', (data) => {
          // console.log('data.length', data.length);
          // totalSize += data.length;
          // console.log('data[data.length - 1]', data[data.length - 1]);
          returnedTrytes = Buffer.concat([returnedTrytes, data])
          if (data[data.length - 1] === 10) {
            let response = JSON.parse(returnedTrytes.toString('utf8'))
            console.log(response)
            resolve(response.trytes)
          }
        })
        port.write(bytestream)
      })
    }
  })
  mamState = Mam.changeMode(mamState, 'public')

  const publish = async data => {
    console.log('PUBLISH!')
    // Convert the JSON to trytes and create a MAM message
    const trytes = asciiToTrytes(data)
    const message = Mam.create(mamState, trytes)

    // Update the MAM state to the state of this latest message
    // We need this so the next publish action knows it's state
    mamState = message.state

    // Attach the message
    await Mam.attach(message.payload, message.address, 3, 9, 'CRAIG9FPGA')
      .then((data) => {
        console.log('data', data)
      })
      .catch(err => {
        console.log('err', err)
      })
    console.log('Sent message to the Tangle!')
    console.log('Address: ' + message.root)
  }

  publish('This is an ICC FPGA TEST')
  setTimeout(() => {
    publish('This is another ICC FPGA TEST')
  }, 15000)
})
