const Gpio = require('onoff').Gpio // https://www.npmjs.com/package/onoff#writesyncvalue & https://pinout.xyz/pinout/pin13_gpio27

const garageOpenerCloser = new Gpio(27, 'out')

garageOpenerCloser.writeSync(1)
setTimeout(() => {
  garageOpenerCloser.writeSync(0)
}, 750)

process.on('SIGINT', () => {
  garageOpenerCloser.unexport()
})
