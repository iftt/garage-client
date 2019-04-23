const Gpio = require('onoff').Gpio // https://www.npmjs.com/package/onoff#writesyncvalue & https://pinout.xyz/pinout/pin13_gpio27

const reedSwitch = new Gpio(22, 'in', 'both', { debounceTimeout: 50 })

reedSwitch.read((err, value) => {
  if (err) { console.log('err', err) }
  console.log('value', value)
})

reedSwitch.watch((err, status) => {
  if (err) { console.log(err) }
  console.log(status)
})

process.on('SIGINT', () => {
  reedSwitch.unexport()
})
